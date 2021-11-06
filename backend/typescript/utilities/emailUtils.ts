import Schedule from "../models/scheduling.model";
import User from "../models/user.model";

const createReminderEmailContent = (schedule: Schedule, user: User): string => {
  // TODO: need a final email body from designers

  return `
      <html>
        <body>
          Test content: ${user.email}
        </body>
      </html>
    `;
};

export default createReminderEmailContent;