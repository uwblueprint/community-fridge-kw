import * as firebaseAdmin from "firebase-admin";

import IAuthService from "../interfaces/authService";
import IEmailService from "../interfaces/emailService";
import IUserService from "../interfaces/userService";
import { AuthDTO, Role, Token } from "../../types";
import FirebaseRestClient from "../../utilities/firebaseRestClient";
import logger from "../../utilities/logger";
import getErrorMessage from "../../utilities/errorMessageUtil";
import {
  emailHeader,
  emailFooter,
  getAdminEmail,
} from "../../utilities/emailUtils";

const Logger = logger(__filename);

class AuthService implements IAuthService {
  userService: IUserService;

  emailService: IEmailService | null;

  constructor(
    userService: IUserService,
    emailService: IEmailService | null = null,
  ) {
    this.userService = userService;
    this.emailService = emailService;
  }

  /* eslint-disable class-methods-use-this */
  async generateToken(email: string, password: string): Promise<AuthDTO> {
    try {
      const token = await FirebaseRestClient.signInWithPassword(
        email,
        password,
      );
      const user = await this.userService.getUserByEmail(email);
      return { ...token, ...user };
    } catch (error) {
      Logger.error(`Failed to generate token for user with email ${email}`);
      throw error;
    }
  }

  /* eslint-disable class-methods-use-this */
  async verifyEmail(oobCode: string): Promise<boolean> {
    try {
      const response = await FirebaseRestClient.confirmEmailVerificationCode(
        oobCode,
      );
      if (response.emailVerified) {
        const user = await this.userService.getUserByEmail(response.email);

        if (user.role === Role.VOLUNTEER) {
          await this.sendEmailVolunteerPending(response.email);
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /* eslint-disable class-methods-use-this */
  async verifyPasswordReset(oobCode: string): Promise<boolean> {
    try {
      const response = await FirebaseRestClient.confirmPasswordResetVerificationCode(
        oobCode,
      );
      if (response.email) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /* eslint-disable class-methods-use-this */
  async confirmPasswordReset(
    newPassword: string,
    oobCode: string,
  ): Promise<boolean> {
    try {
      const response = await FirebaseRestClient.confirmPasswordReset(
        newPassword,
        oobCode,
      );

      if (response.email) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async revokeTokens(userId: string): Promise<void> {
    try {
      const authId = await this.userService.getAuthIdById(userId);

      await firebaseAdmin.auth().revokeRefreshTokens(authId);
    } catch (error: unknown) {
      const errorMessage = [
        "Failed to revoke refresh tokens of user with id",
        `${userId}.`,
        "Reason =",
        getErrorMessage(error),
      ];
      Logger.error(errorMessage.join(" "));

      throw error;
    }
  }

  async renewToken(refreshToken: string): Promise<Token> {
    try {
      return await FirebaseRestClient.refreshToken(refreshToken);
    } catch (error) {
      Logger.error("Failed to refresh token");
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call resetPassword but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const resetLink = await firebaseAdmin
        .auth()
        .generatePasswordResetLink(email);
      const emailBody = `
      <html>
      ${emailHeader}
      <body>
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hi there,</h2>
        <p> 
          This is an email verifying your request to change your password for Community Fridge. Please click on “Change Password” if you’d like to create a new password for the Community Fridge KW platform. 
        </p>
        <table cellspacing = "0" cellpadding = "0"> <tr>
          <td align="center" width = "255" height = "44" bgcolor = "#C31887" style = "-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;" >
            <a href=${resetLink} style = "font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block" >
              <span style="color: #FAFCFE;" >
                Change password
              </span>
            </a>
          </td> 
        </tr></table >
        <h5 style="font-weight: bold; font-size: 16px; line-height: 22px; color: #6C6C84;">
          How does this work?
        </h5>
        <p style = "color:#6C6C84">
          This is a one - time URL that lets you change your password.
        </p>
        <div style = "width: 100%">
          <div style= " float:left; color: #6C6C84">
            Don't see a button above? 
          </div>
          <a style=" color: #C31887" href=${resetLink}>Change your password here</a>
        </div>
        <div> 
          If you didn't request this reset link, you can safely ignore this email.
        </div>
        ${emailFooter}
      </body>
      </html>`;

      this.emailService.sendEmail(email, "Your Password Reset Link", emailBody);
    } catch (error) {
      Logger.error(
        `Failed to generate password reset link for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendEmailVerificationLink(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailVerificationLink but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const emailVerificationLink = await firebaseAdmin
        .auth()
        .generateEmailVerificationLink(email);

      const emailBody = `
      <html>
      ${emailHeader}
      <body>
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hey neighbour!</h2>
        <p>Thank you for getting involved with mutual aid through Community Fridge
          KW. We’re thrilled to have you.
          <br />
          <br />
          Click "Verify" to confirm that this is the email address (${email}) you would like to use to schedule donations with Community Fridge KW.
        </p>
         <table cellspacing="0" cellpadding="0"> <tr> 
      <td align="center" width="255" height="44" bgcolor="#C31887" style="-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;">
        <a href=${emailVerificationLink} style="font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
        <span style="color: #FAFCFE;">
          Verify
        </span>
        </a>
      </td> 
      </tr> </table> 
        <h5 style="font-weight: bold; font-size: 16px;
      line-height: 22px; color: #6C6C84;">How does this work?</h5>
        <p style="color:#6C6C84">This is a one-time URL that lets you confirm your
          identity that lasts for 1 hour.
        </p>
       <div style="width: 100%"> <div style=" float:left; color: #6C6C84">Don't see a button above? </div><a style=" color: #C31887" href=${emailVerificationLink}> Verify yourself here</a></div>
       <div> If you didn't request this verification
       link, you can safely ignore this email.</div>
       ${emailFooter} 
      </body>
    </html>
      `;

      this.emailService.sendEmail(email, "Verify your email", emailBody);
    } catch (error) {
      Logger.error(
        `Failed to generate email verification link for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendEmailVolunteerPending(email: string): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailVolunteerPending but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const emailBody = `
      <html>
      ${emailHeader}
      <body>
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hey there,</h2>
        <p>Thank you for your interest in volunteering with Community Fridge KW!<br /><br />
        Your account is <strong>pending approval</strong>. After an admin approves your account, you will be notified via email and will be able to start signing up for volunteer shifts!<br /><br />
        In the meantime, if you have any questions, please reach out at communityfridge@uwblueprint.org.
        </p>
       ${emailFooter}
      </body>
    </html>
      `;

      this.emailService.sendEmail(email, "Pending Status", emailBody);
    } catch (error) {
      Logger.error(
        `Failed to generate volunteer pending email for user with email ${email}`,
      );
      throw error;
    }
  }

  async sendAdminVolunteerSignUpEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendAdminVolunteerSignUpEmail but this instance of AuthService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const emailBody = `<html>
      ${emailHeader}
      <body>
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">A new volunteer has signed up!</h2>
        <p>${fullName} is interested in becoming a volunteer.
          <br />
          <br />
          Please approve this volunteer (${email}) for the Community Fridge KW volunteer by clicking "Approve"
        </p>
         <table cellspacing="0" cellpadding="0"> <tr> 
      <td align="center" width="255" height="44" bgcolor="#C31887" style="-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;">
        <a href="https://schedule.communityfridgekw.ca/user-management" style="font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
        <span style="color: #FAFCFE;">
          Approve
        </span>
        </a>
      </td> 
      </tr> </table> 
       ${emailFooter} 
      </body>
    </html>`;
      this.emailService.sendEmail(
        getAdminEmail(),
        `Volunteer Approval Required: ${fullName}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate admin email for new volunteer sign up for volunteer with email ${email}`,
      );
      throw error;
    }
  }

  async isAuthorizedByRole(
    accessToken: string,
    roles: Set<Role>,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);
      const userRole = await this.userService.getUserRoleByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return firebaseUser.emailVerified && roles.has(userRole);
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByUserId(
    accessToken: string,
    requestedUserId: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);
      const tokenUserId = await this.userService.getUserIdByAuthId(
        decodedIdToken.uid,
      );

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);

      return (
        firebaseUser.emailVerified && String(tokenUserId) === requestedUserId
      );
    } catch (error) {
      return false;
    }
  }

  async isAuthorizedByEmail(
    accessToken: string,
    requestedEmail: string,
  ): Promise<boolean> {
    try {
      const decodedIdToken: firebaseAdmin.auth.DecodedIdToken = await firebaseAdmin
        .auth()
        .verifyIdToken(accessToken, true);

      const firebaseUser = await firebaseAdmin
        .auth()
        .getUser(decodedIdToken.uid);
      return (
        firebaseUser.emailVerified && decodedIdToken.email === requestedEmail
      );
    } catch (error) {
      return false;
    }
  }
}

export default AuthService;
