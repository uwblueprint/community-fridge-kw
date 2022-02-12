import { Center, Spinner } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import NewPassword from "./ResetPassword/NewPassword";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";

enum EmailVerificationResponse {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

enum ActionModes {
  EMAIL_VERIFICATION = "verifyEmail",
  PASSWORD_RESET = "resetPassword",
}

const Action = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");

  const [emailVerified, setEmailVerified] = React.useState(false);
  const [passwordResetVerified, setPasswordResetVerified] = React.useState(
    false,
  );

  const confirmEmailVerification = async () => {
    const confirmEmailVerificationResponse = await AuthAPIClient.confirmEmailVerification(
      oobCode ?? "",
    );
    if (confirmEmailVerificationResponse) {
      setEmailVerified(true);
    }
  };

  const confirmPasswordReset = async () => {
    const confirmPasswordResetResponse = await AuthAPIClient.verifyPasswordResetCode(
      oobCode ?? "",
    );
    if (confirmPasswordResetResponse) {
      setPasswordResetVerified(true);
    }
  };

  if (mode === ActionModes.EMAIL_VERIFICATION) {
    confirmEmailVerification();
    return emailVerified ? (
      <ConfirmVerificationPage />
    ) : (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (mode === ActionModes.PASSWORD_RESET) {
    confirmPasswordReset();

    return (
      <Center>
        {passwordResetVerified ? (
          <NewPassword oobCode={oobCode ?? ""} />
        ) : (
          "Password Reset Verification Failed"
        )}
      </Center>
    );
  }
  return <></>;
};
export default Action;
