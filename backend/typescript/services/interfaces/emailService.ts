interface IEmailService {
  /**
   * Send email
   * @param to recipient's email
   * @param subject email subject
   * @param htmlBody email body as html
   * @throws Error if email was not sent successfully
   */
  sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;

  /**
   * Cron job that sends reminder email
   * @throws Error if email was not sent successfully
   */
  checkReminders(): Promise<void>;
}

export default IEmailService;
