import Schedule from "../../models/scheduling.model";

interface ICronService {
  /**
   * Generate an email regarding a 24 hour email reminder for a donation
   * @param schedule object that contains information on scheduled donation
   * @throws Error if unable to send email
   */
  sendScheduledDonationEmail(schedule: Schedule): Promise<void>;

  /**
   * Cron job that sends reminder email
   * @throws Error if email was not sent successfully
   */
  checkReminders(): Promise<void>;
}

export default ICronService;
