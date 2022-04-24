import Schedule from "../../models/scheduling.model";

interface ICronService {
  /**
   * Generate an email regarding a 24 hour email reminder for a donation
   * @param schedule object that contains information on scheduled donation
   * @throws Error if unable to send email
   */
  sendScheduledDonationEmail(schedule: Schedule): Promise<void>;

  /**
   * Sends donor reminder email
   * @throws Error if email was not sent successfully
   */
  checkScheduleReminders(): Promise<void>;

  /**
   * Sends volunteer reminder email
   * @throws Error if email was not sent successfully
   */
  checkCheckInReminders(): Promise<void>;
}

export default ICronService;
