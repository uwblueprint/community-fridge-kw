import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Op } from "sequelize";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import IEmailService from "../interfaces/emailService";
import { UserDonorDTO, UserVolunteerDTO } from "../../types";
import logger from "../../utilities/logger";
import Schedule from "../../models/scheduling.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import ICronService from "../interfaces/cronService";
import IDonorService from "../interfaces/donorService";
import {
  emailHeader,
  emailFooter,
  formatDonorContactInformation,
  formatFoodRescueShiftInformation,
  formatVolunteerContactInformation,
  formatCheckinShiftInformation,
  getAdminEmail,
} from "../../utilities/emailUtils";
import IVolunteerService from "../interfaces/volunteerService";
import IContentService from "../interfaces/contentService";
import ContentService from "./contentService";
import CheckIn from "../../models/checkIn.model";

// eslint-disable-next-line
const cron = require("node-cron");

const Logger = logger(__filename);

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/New_York");

class CronService implements ICronService {
  emailService: IEmailService | null;

  donorService: IDonorService;

  volunteerService: IVolunteerService;

  constructor(
    emailService: IEmailService | null = null,
    donorService: IDonorService,
    volunteerService: IVolunteerService,
  ) {
    this.emailService = emailService;
    this.donorService = donorService;
    this.volunteerService = volunteerService;
  }

  async sendScheduledDonationEmail(schedule: Schedule): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to send email regarding 24 hour email reminder but this instance of CronService does not have an EmailService instance";
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
      const startDayString: string = dayjs.tz(startTime).format("dddd, MMMM D");

      const startTimeString: string = dayjs.tz(startTime).format("h:mm A");
      const endTimeString: string = dayjs.tz(endTime).format("h:mm A");

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

            <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              If you requested a volunteer, please login on the <a href="https://schedule.communityfridgekw.ca">platform</a> 
              and check your donation details for the volunteer contact information.
            </p>

            <p style="margin: 0.5em 0 1.5em 0; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              ${
                schedule.volunteer_needed && schedule.volunteer_id
                  ? `Please meet the volunteer you requested at ${volunteerTimeString}${
                      schedule.is_pickup ? `at ${schedule.pickup_location}` : ""
                    }. <br />`
                  : ``
              }
            </p>
            ${emailFooter}
          </body>
        </html>
      `;

      this.emailService.sendEmail(
        email,
        `Reminder: Scheduled Donation for ${startDayString} between ${startTimeString} - ${endTimeString}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to send a 24 hour reminder of donation scheduled by ${currDonor.email}`,
      );
      throw error;
    }
  }

  async sendVolunteerSchedulingReminderEmail(
    schedule: Schedule,
    volunteer: UserVolunteerDTO | null,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerSchedulingReminderEmail but this instance of CronService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const contentService: IContentService = new ContentService();
      const { foodRescueUrl } = await contentService.getContent();
      const donor = await this.donorService.getDonorById(
        String(schedule.donor_id),
      );
      dayjs.extend(customParseFormat);
      const startDayString: string = dayjs
        .tz(schedule.start_time)
        .format("dddd, MMMM D");
      const volunteerStartTime: string = dayjs(
        schedule.volunteer_time,
        "HH:mm",
      ).format("h:mm A");
      const emailBody = `<html>
        ${emailHeader}
        <body>
        
          <p>${
            isAdmin
              ? `No Volunteer has signed up for this shift`
              : `This is a friendly reminder of your upcoming shift!`
          }<br /><br />
        
          Here is a shift summary: <br /> <br />
          Food Rescue Instructions:  <a href="${foodRescueUrl}">here</a>
          </p>
         ${formatFoodRescueShiftInformation(
           schedule.is_pickup,
           schedule.pickup_location ?? "",
           startDayString,
           volunteerStartTime,
           schedule.notes ?? "",
         )}
          ${
            !isAdmin && volunteer
              ? formatVolunteerContactInformation(
                  volunteer.firstName,
                  volunteer.lastName,
                  volunteer.phoneNumber,
                  volunteer.email,
                )
              : ""
          }
          ${formatDonorContactInformation(
            donor.firstName,
            donor.lastName,
            donor.phoneNumber,
            donor.email,
          )}
         
         ${emailFooter}
        </body>
      </html>
        `;
      this.emailService.sendEmail(
        isAdmin ? getAdminEmail() : volunteer!.email,
        `Reminder: Food Rescue Shift for ${startDayString} at ${volunteerStartTime}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(`Failed to generate email for food rescue shift reminder`);
      throw error;
    }
  }

  async checkScheduleReminders(): Promise<void> {
    const tomorrow: Date = dayjs().add(1, "days").toDate();
    const dayAfterTomorrow: Date = dayjs().add(2, "days").toDate();

    try {
      const schedules: Array<Schedule> = await Schedule.findAll({
        where: {
          start_time: {
            [Op.and]: [{ [Op.gte]: tomorrow }, { [Op.lte]: dayAfterTomorrow }],
          },
        },
      });

      schedules.forEach(async (schedule: Schedule) => {
        this.sendScheduledDonationEmail(schedule);
        if (schedule.volunteer_id) {
          const volunteer: UserVolunteerDTO = await this.volunteerService.getVolunteerById(
            String(schedule.volunteer_id),
          );
          this.sendVolunteerSchedulingReminderEmail(schedule, volunteer, false);
        } else {
          this.sendVolunteerSchedulingReminderEmail(schedule, null, true);
        }
      });
    } catch (error) {
      Logger.error(
        `Failed to send reminders. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async checkCheckInReminders(): Promise<void> {
    const tomorrow: Date = dayjs().add(1, "days").toDate();
    const dayAfterTomorrow: Date = dayjs().add(2, "days").toDate();

    try {
      const checkIns: Array<CheckIn> = await CheckIn.findAll({
        where: {
          start_date: {
            [Op.and]: [{ [Op.gte]: tomorrow }, { [Op.lte]: dayAfterTomorrow }],
          },
        },
      });

      checkIns.forEach(async (checkIn: CheckIn) => {
        if (checkIn.volunteer_id) {
          const volunteer: UserVolunteerDTO = await this.volunteerService.getVolunteerById(
            String(checkIn.volunteer_id),
          );
          this.sendVolunteerCheckInReminderEmail(checkIn, volunteer, false);
        } else {
          this.sendVolunteerCheckInReminderEmail(checkIn, null, true);
        }
      });
    } catch (error) {
      Logger.error(
        `Failed to send reminders. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendVolunteerCheckInReminderEmail(
    checkIn: CheckIn,
    volunteer: UserVolunteerDTO | null,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerCheckInReminderEmail but this instance of CronService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const contentService: IContentService = new ContentService();
      const { checkinUrl } = await contentService.getContent();
      const startDayString: string = dayjs
        .tz(checkIn.start_date)
        .format("dddd, MMMM D");
      const startTimeString: string = dayjs
        .tz(checkIn.start_date)
        .format("h:mm A");
      const endTimeString: string = dayjs.tz(checkIn.end_date).format("h:mm A");
      const emailBody = `<html>
        ${emailHeader}
        <body>
        <p>${
          isAdmin
            ? `No Volunteer has signed up for this shift`
            : `This is a friendly reminder of your upcoming shift!`
        }<br /><br />
        
        Here is a shift summary: <br /> <br />
        Fridge Check-in Instructions: <a href="${checkinUrl}">here</a>
        </p>
          
          ${
            !isAdmin && volunteer
              ? formatVolunteerContactInformation(
                  volunteer.firstName,
                  volunteer.lastName,
                  volunteer.phoneNumber,
                  volunteer.email,
                )
              : ""
          }
          ${formatCheckinShiftInformation(
            startDayString,
            startTimeString,
            endTimeString,
            checkIn.notes ?? "",
          )}
         ${emailFooter}
        </body>
      </html>
        `;
      this.emailService.sendEmail(
        isAdmin ? getAdminEmail() : volunteer!.email,
        `Reminder: Fridge Check-in Shift for ${startDayString} at ${startTimeString}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email for fridge check-in shift reminder`,
      );
      throw error;
    }
  }
}

export default CronService;
