import nodemailer, { Transporter } from "nodemailer";
import dayjs from "dayjs";
import IEmailService from "../interfaces/emailService";
import { NodemailerConfig } from "../../types";
import logger from "../../utilities/logger";
import Schedule from "../../models/scheduling.model";
import User from "../../models/user.model";
import createReminderEmailContent from "../../utilities/emailUtils";

// eslint-disable-next-line
const cron = require("node-cron");

const Logger = logger(__filename);

class EmailService implements IEmailService {
  transporter: Transporter;

  sender: string;

  constructor(nodemailerConfig: NodemailerConfig, displayName?: string) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
    if (displayName) {
      this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
    } else {
      this.sender = nodemailerConfig.auth.user;
    }
  }

  async checkReminders(): Promise<void> {
    cron.schedule("0 0 0 * *", async () => {
      const schedules: Array<Schedule> = await Schedule.findAll({
        where: {
          start_time: {
            lte: dayjs().add(1, "days").toDate(),
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
          this.sendEmail(
            user.email,
            "Test subject", // TODO: test subject needs to be changed
            createReminderEmailContent(schedule, user),
          );
        } catch (error) {
          Logger.error(
            `Failed to send reminder email. Reason = ${error.message}`,
          );
          throw error;
        }
      });
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.sender,
      to,
      subject,
      html: htmlBody,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      Logger.error(`Failed to send email. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default EmailService;
