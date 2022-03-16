import Schedule from "../models/scheduling.model";
import User from "../models/user.model";

export const createReminderEmailContent = (
  schedule: Schedule,
  user: User,
): string => {
  // TODO: need a final email body from designers

  return `
      <html>
        <body>
          Test content: ${user.email}
        </body>
      </html>
    `;
};

export const cancellationEmail = (mainLine: string, name: string): string => {
  return `
  <html >
  <head>
    <link
    href="https://fonts.googleapis.com/css2?family=Inter"
    rel="stylesheet"
    />
    <style>
     body {
         font-family: "Inter";
     }
 </style>
 <meta charset="utf-8" />
 <meta http-equiv="x-ua-compatible" content="ie=edge" />
 <title>Donation Details Email</title>
 </head>
 <body>
    <p><img src=https://community-fridge-logo.s3.us-west-004.backblazeb2.com/community-fridge-logo.png
     style="width: 134px; margin-bottom: 20px;  alt="CFKW Logo"/></p>
     <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717;">Hey there ${name}!</h2>
     <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">${mainLine}
 </p>
 
 <table cellspacing="0" cellpadding="0"> <tr> 
      <td align="center" width="255" height="44" bgcolor="#C31887" style="-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;">
        <a href="https://communityfridgekw.web.app/" style="font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
        <span style="color: #FAFCFE;">
          View Dashboard
        </span>
        </a>
      </td> 
      </tr> </table> 
        <p style="color:#6C6C84"> <b>Have a question?</b> <br/>
          Contact Community Fridge KW at <a href="mailto: communityfridgekw@gmail.com">communityfridgekw@gmail.com </a>
        </p>
        <br/>
 <p style="margin-top: 50px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Sincerely,</p>
 <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Community Fridge KW</p>   
 </body>
 </html>
  `;
};

export const getAdminEmail = (): string => {
  return process.env.NODE_ENV === "production"
    ? "communityfridgekw@gmail.com"
    : "hanlincheng@uwblueprint.org";
};
