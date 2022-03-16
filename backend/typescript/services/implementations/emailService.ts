import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import { NodemailerConfig } from "../../types";
import logger from "../../utilities/logger";
import Schedule from "../../models/scheduling.model";
import User from "../../models/user.model";
import { createReminderEmailContent } from "../../utilities/emailUtils";
import getErrorMessage from "../../utilities/errorMessageUtil";

const Logger = logger(__filename);

class EmailService implements IEmailService {
  transporter: Transporter;

  sender?: string;

  constructor(nodemailerConfig: NodemailerConfig, displayName?: string) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
    if (displayName) {
      this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
    } else {
      this.sender = nodemailerConfig.auth.user;
    }
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
      Logger.error(`Failed to send email. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default EmailService;
