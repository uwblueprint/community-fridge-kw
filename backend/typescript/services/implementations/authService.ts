import * as firebaseAdmin from "firebase-admin";

import IAuthService from "../interfaces/authService";
import IEmailService from "../interfaces/emailService";
import IUserService from "../interfaces/userService";
import { AuthDTO, Role, Token } from "../../types";
import FirebaseRestClient from "../../utilities/firebaseRestClient";
import logger from "../../utilities/logger";
import getErrorMessage from "../../utilities/errorMessageUtil";

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
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /* eslint-disable class-methods-use-this */
  async generateTokenOAuth(idToken: string): Promise<AuthDTO> {
    try {
      const googleUser = await FirebaseRestClient.signInWithGoogleOAuth(
        idToken,
      );
      // googleUser.idToken refers to the Firebase Auth access token for the user
      const token = {
        accessToken: googleUser.idToken,
        refreshToken: googleUser.refreshToken,
      };
      // If user already has a login with this email, just return the token
      try {
        // Note: an error message will be logged from UserService if this lookup fails.
        // You may want to silence the logger for this special OAuth user lookup case
        const user = await this.userService.getUserByEmail(googleUser.email);
        return { ...token, ...user };
      } catch (error) {
        Logger.error(error as string);
      }

      const user = await this.userService.createUser(
        {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          role: Role.USER,
          password: "",
          phoneNumber: googleUser.phoneNumber,
        },
        googleUser.localId,
        "GOOGLE",
      );

      return { ...token, ...user };
    } catch (error) {
      Logger.error(`Failed to generate token for user with OAuth ID token`);
      throw error;
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
      Hello,
      <br><br>
      We have received a password reset request for your account.
      Please click the following link to reset it.
      <strong>This link is only valid for 1 hour.</strong>
      <br><br>
      <a href=${resetLink}>Reset Password</a>`;

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
        <title>Welcome Email</title>
      </head>
      <body>
         <p><img src=https://community-fridge-logo.s3.us-west-004.backblazeb2.com/community-fridge-logo.png
                        style="width: 134px; margin-bottom: 20px;  alt="CFKW Logo"/></p>
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
     
       <p style="margin-top: 50px">Sincerely,</p>
        <p>Community Fridge KW</p>   
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
