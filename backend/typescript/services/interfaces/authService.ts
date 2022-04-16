import { AuthDTO, Role, Token } from "../../types";

interface IAuthService {
  /**
   * Generate a short-lived JWT access token and a long-lived refresh token
   * when supplied user's email and password
   * @param email user's email
   * @param password user's password
   * @returns AuthDTO object containing the access token, refresh token, and user info
   * @throws Error if token generation fails
   */
  generateToken(email: string, password: string): Promise<AuthDTO>;

  /**
   * Revoke all refresh tokens of a user
   * @param userId userId of user whose refresh tokens are to be revoked
   * @throws Error if token revocation fails
   */
  revokeTokens(userId: string): Promise<void>;

  /**
   * Generate new access and refresh token pair using the provided refresh token
   * @param refreshToken refresh token
   * @returns Token object containing new access and refresh tokens
   * @throws Error if token renewal fails
   */
  renewToken(refreshToken: string): Promise<Token>;

  /**
   * Generate a password reset link for the user with the given email and send
   * the link to that email address
   * @param email email of user requesting password reset
   * @throws Error if unable to generate link or send email
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Generate an email verification link for the user with the given email and send
   * the link to that email address
   * @param email email of user that needs to be verified
   * @throws Error if unable to generate link or send email
   */
  sendEmailVerificationLink(email: string): Promise<void>;

  /**
   * Sends an email about the volunteer pending status for the user with the given email
   * @param email email of user that has pending status
   * @throws Error if unable to send email
   */
  sendEmailVolunteerPending(email: string): Promise<void>;

  /**
   * Sends admin an email alerting them of new volunteer sign up and asks for volunteer approval
   * @param email email of volunteer that has pending status
   * @param fullName of volunteer
   * @throws Error if unable to send email
   */
  sendAdminVolunteerSignUpEmail(email: string, fullName: string): Promise<void>;

  /**
   * Sends an email to a volunteer when their status is approved
   * @param email email of volunteer that has approved status
   * @param firstName of volunteer
   * @throws Error if unable to send email
   */
  sendVolunteerApprovedEmail(email: string, firstName: string): Promise<boolean>;

  /**
   * Determine if the provided access token is valid and authorized for at least
   * one of the specified roles
   * @param accessToken user's access token
   * @param roles roles to check for
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByRole(accessToken: string, roles: Set<Role>): Promise<boolean>;

  /**
   * Determine if the provided access token is valid and issued to the requested user
   * @param accessToken user's access token
   * @param requestedUserId userId of requested user
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByUserId(
    accessToken: string,
    requestedUserId: string,
  ): Promise<boolean>;

  /**
   * Determine if the provided access token is valid and issued to the requested user
   * with the specified email address
   * @param accessToken user's access token
   * @param requestedEmail email address of requested user
   * @returns true if token valid and authorized, false otherwise
   */
  isAuthorizedByEmail(
    accessToken: string,
    requestedEmail: string,
  ): Promise<boolean>;

  /**
   * Confirm email verification link is valid and issued to the requested user
   * @param oobCode user's oob code to verify request
   * @returns true if email verification confirmation is authorized, false otherwise
   */
  verifyEmail(oobCode: string): Promise<boolean>;

  /**
   * Verify password reset verification link is valid and issued to the requested user
   * @param oobCode user's oob code to verify request
   * @returns true if password reset verification confirmation is authorized, false otherwise
   */
  verifyPasswordReset(oobCode: string): Promise<boolean>;

  /**
   * Confirm password reset verification link is valid and issued to the requested user
   * @param newPassword new password to set
   * @param oobCode user's oob code to verify request
   * @returns true if new password change is successful, false otherwise
   */
  confirmPasswordReset(newPassword: string, oobCode: string): Promise<boolean>;
}

export default IAuthService;
