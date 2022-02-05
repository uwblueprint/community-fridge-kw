import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import NewPassword from "./ResetPassword/NewPassword";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";

enum EmailVerificationResponse {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

const Action = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");

  const [emailVerified, setEmailVerified] = React.useState(false);
  const [passwordResetVerified, setPasswordResetVerified] = React.useState(false);

  if (mode === "verifyEmail") {
    const confirmEmailVerification = async () => {
      const confirmEmailVerificationResponse = await AuthAPIClient.confirmEmailVerification(
        oobCode ?? "",
      );
      if (confirmEmailVerificationResponse) {
        setEmailVerified(true);
      }
    };
    React.useEffect(() => {
      confirmEmailVerification();
    }, []);
  }
  else if (mode === "passwordReset") {
    const confirmPasswordReset = async () => {
      const confirmPasswordResetResponse = await AuthAPIClient.confirmPasswordReset(
        oobCode ?? "",
      );
      if (confirmPasswordResetResponse) {
        setPasswordResetVerified(true);
      }
    };
    React.useEffect(() => {
      confirmPasswordReset();
    }, []);
  }

  return emailVerified ? (
    <ConfirmVerificationPage />
  ) : passwordResetVerified ? (
   <></>
  ): (
      <Center>Sorry, there was a problem verifying the email.</Center >
  );
};
export default Action;
