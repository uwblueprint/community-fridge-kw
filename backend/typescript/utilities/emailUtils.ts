export const emailHeader = `
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
    <title>CFKW Email</title>
  </head>
  <p><img src=https://community-fridge-logo.s3.us-west-004.backblazeb2.com/community-fridge-logo.png
    style="width: 134px; margin-bottom: 20px;  alt="CFKW Logo"/></p>
  `;

export const emailFooter = `
  <footer style="margin-top: 10px">
    <p>Sincerely,</p>
    <p>Community Fridge KW</p>
    <p><a href="mailto:info@communityfridgekw.ca">info@communityfridgekw.ca</a></p>
    <p><a href="https://www.facebook.com/CommunityFridgeKW/" target="_blank">Facebook</a> | <a href="https://www.instagram.com/communityfridgekw/" target="_blank">Instagram</a></p>
  </footer>
  `;

export const cancellationEmail = (
  mainLine: string,
  name: string,
  isVolunteer?: boolean,
): string => {
  return `
      <html >
      ${emailHeader}
      <body>
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717;">Hey there ${name}!</h2>
        <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">${mainLine}
        </p>
        ${
          isVolunteer
            ? `<div style=" display:in-line-block;" ><p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717; display:in-line-block;">
        We apologize for the cancellation but would love to stay connected! If you are interested and available for another shift, 
        <a href="https://schedule.communityfridgekw.ca/volunteer-shifts"  style=" color: #C31887; font-size:16px; font-family:sans-serif; text-decoration: underline; line-height:24px; display:inline-block"> please sign up here. </a>
        </p></div>`
            : `<table cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" width="255" height="44" bgcolor="#C31887" style="-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;">
              <a href="https://schedule.communityfridgekw.ca/" style="font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
              <span style="color: #FAFCFE;">
              View Dashboard
              </span>
              </a>
          </td>
        </tr>
    </table>
    <br/>`
        }
        
        ${emailFooter}
      </body>
    </html>
    `;
};

export const formatCheckinShiftInformation = (
  startDay: string,
  startTime: string,
  endTime: string,
  notes: string,
) => {
  return `
  <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
  Shift Information:
  </h2>
  <p>
    <b>Date:</b> ${startDay} <br/>
    <b>Time:</b> ${startTime} - ${endTime} <br/>
    <b>Additional Notes:</b> <br/>
    ${notes} 
  </p>
  `;
};

export const formatFoodRescueShiftInformation = (
  isPickup: boolean,
  address: string,
  startDay: string,
  volunteerStartTime: string,
  notes: string,
) => {
  return `
  <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
  Shift Information:
  </h2>
  <p>
    <b>Volunteer shift type:</b> ${
      isPickup ? "Food rescue pickup" : "Food rescue unloading"
    }<br/>
    <b>Volunteer arrival time:</b> ${startDay} at ${volunteerStartTime}<br/>
    <b>Address</b> ${isPickup ? address : "Community Fridge KW"}<br/>
    <b>Additional Notes:</b> <br/>
    ${notes} 
  </p>
  `;
};

export const formatVolunteerContactInformation = (
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
) => {
  return `
  <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
        Volunteer Contact Information:
  </h2>
        <p>
          <b>Name:</b> ${firstName} ${lastName} <br/>
          <b>Phone Number:</b> ${phoneNumber} <br/>
          <b>Email:</b> ${email} <br/>
        </p>
  `;
};

export const formatDonorContactInformation = (
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
) => {
  return `
  <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
  Donor Contact Information:
  </h2>
        <p>
          <b>Name:</b> ${firstName} ${lastName} <br/>
          <b>Phone Number:</b> ${phoneNumber} <br/>
          <b>Email:</b> ${email} <br/>
        </p>
  
  `;
};
export const getAdminEmail = (): string => {
  return process.env.NODE_ENV === "production"
    ? "communityfridgekw@gmail.com"
    : "communityfridgekw@uwblueprint.org";
};
