import { AUTHENTICATED_USER_KEY } from "../constants/AuthConstants";
import { AuthenticatedUser } from "../types/AuthTypes";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const login = async (
  email: string,
  password: string,
): Promise<AuthenticatedUser> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
    if (data.isEmailVerified) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    return null;
  }
};

const loginWithGoogle = async (idToken: string): Promise<AuthenticatedUser> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/login",
      { idToken },
      { withCredentials: true },
    );
    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    return null;
  }
};

const logout = async (userId: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  businessName: string,
  role: string,
  cityQuestionResponse?: string,
  intentionQuestionResponse?: string,
  skillsQuestionResponse?: string,
): Promise<AuthenticatedUser> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/register",
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
        businessName,
        cityQuestionResponse,
        intentionQuestionResponse,
        skillsQuestionResponse,
      },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const resetPassword = async (email: string | undefined): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

const confirmEmailVerification = async (oobCode: string): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/confirmEmailVerification/${oobCode}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const resendEmailVerification = async (email: string): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/resendEmailVerification/${email}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const verifyPasswordResetCode = async (oobCode: string): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/verifyPasswordResetCode/${oobCode}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const confirmPasswordReset = async (
  oobCode: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/confirmPasswordReset/${newPassword}?oobCode=${oobCode}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const sendVolunteerApprovedEmail = async (
  email: string,
  firstName: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.post(
      `/auth/approveVolunteer/${email}?firstName=${firstName}`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  confirmEmailVerification,
  verifyPasswordResetCode,
  confirmPasswordReset,
  login,
  logout,
  loginWithGoogle,
  register,
  resetPassword,
  resendEmailVerification,
  refresh,
  sendVolunteerApprovedEmail,
};
