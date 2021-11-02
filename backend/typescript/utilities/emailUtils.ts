import Schedule from "../../models/scheduling.model";
import User from "../../models/user.model";

const createReminderEmailContent = (schedule: Schedule, user: User): string => {
  const emailBody =
  `
    <html>
      <body>
        Test content: ${user.email}
      </body>
    </html>
  `;
  
  return emailBody;
}

export default createReminderEmailContent;