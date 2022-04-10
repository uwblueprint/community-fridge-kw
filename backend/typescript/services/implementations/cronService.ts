import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Op } from "sequelize";
import IEmailService from "../interfaces/emailService";
import { UserDonorDTO } from "../../types";
import logger from "../../utilities/logger";
import Schedule from "../../models/scheduling.model";
import User from "../../models/user.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import ICronService from "../interfaces/cronService";
import IDonorService from "../interfaces/donorService";
import { emailHeader, emailFooter } from "../../utilities/emailUtils";

// eslint-disable-next-line
const cron = require("node-cron");

const Logger = logger(__filename);

class CronService implements ICronService {
  emailService: IEmailService | null;

  donorService: IDonorService;

  constructor(
    emailService: IEmailService | null = null,
    donorService: IDonorService,
  ) {
    this.emailService = emailService;
    this.donorService = donorService;
  }

  async sendScheduledDonationEmail(schedule: Schedule): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to send email regarding 24 hour email reminder but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const currDonor: UserDonorDTO = await this.donorService.getDonorById(
      String(schedule.donor_id),
    );
    // Proposed drop off info

    try {
      const { firstName, email } = currDonor;
      const startTime = schedule.start_time;
      const endTime = schedule.end_time;

      const startTimeToLocalDate = startTime.toLocaleString("en-US", {
        timeZone: "EST",
      });

      const startDayString: string = dayjs(startTimeToLocalDate).format(
        "dddd, MMMM D",
      );

      const startTimeString: string = dayjs(startTimeToLocalDate).format(
        "h:mm A",
      );
      const endTimeString: string = dayjs(
        endTime.toLocaleString("en-US", {
          timeZone: "EST",
        }),
      ).format("h:mm A");

      dayjs.extend(customParseFormat);

      const volunteerTimeString =
        dayjs(schedule.volunteer_time, "HH:mm").format("h:mm A") ?? "";

      const emailBody = `
        <html>
          ${emailHeader}
          <body>
            <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              <strong>Hey there ${firstName}!</strong>
                <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
                This is a friendly reminder that you have a donation to Community Fridge KW scheduled for:<br />
                Tomorrow, ${startDayString}, between ${startTimeString} - ${endTimeString}.
            </p>

            <p style="margin: 0.5em 0 1.5em 0; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              ${
                schedule.volunteer_needed
                  ? `Please meet the volunteer you requested at ${volunteerTimeString} at ${schedule.pickup_location}. <br />`
                  : ``
              }
            </p>
            ${emailFooter}
          </body>
        </html>
      `;

      this.emailService.sendEmail(
        email,
        `REMINDER: Scheduled Donation to Community Fridge KW`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to send a 24 hour reminder of donation scheduled by ${currDonor.email}`,
      );
      throw error;
    }
  }

  async checkReminders(): Promise<void> {
    const today: Date = dayjs().toDate();
    const tomorrow: Date = dayjs().add(1, "days").toDate();

    try {
      cron.schedule("0 0 0 * *", async () => {
        const schedules: Array<Schedule> = await Schedule.findAll({
          where: {
            start_time: {
              [Op.and]: [{ [Op.gte]: today }, { [Op.lte]: tomorrow }],
            },
          },
        });

        schedules.forEach(async (schedule: Schedule) => {
          const user: User | null = await User.findByPk(
            Number(schedule.donor_id),
          );

          if (!user) {
            throw new Error(`donorId ${schedule.donor_id} not found.`);
          }

          try {
            this.sendScheduledDonationEmail(schedule);
          } catch (error) {
            Logger.error(
              `Failed to send reminder email. Reason = ${getErrorMessage(
                error,
              )}`,
            );
            throw error;
          }
        });
      });
    } catch (error) {
      Logger.error(
        `Failed to run checkReminders cron service. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default CronService;
