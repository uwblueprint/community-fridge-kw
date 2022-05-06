import { Center, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import NewPassword from "./ResetPassword/NewPassword";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";

enum ActionModes {
  EMAIL_VERIFICATION = "verifyEmail",
  PASSWORD_RESET = "resetPassword",
}

const Action = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");

  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordResetVerified, setPasswordResetVerified] = React.useState(
    false,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const confirmEmailVerification = async () => {
      const confirmEmailVerificationResponse = await AuthAPIClient.confirmEmailVerification(
        oobCode ?? "",
      );
      if (confirmEmailVerificationResponse) {
        setEmailVerified(true);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    const confirmPasswordReset = async () => {
      const confirmPasswordResetResponse = await AuthAPIClient.verifyPasswordResetCode(
        oobCode ?? "",
      );
      if (confirmPasswordResetResponse) {
        setPasswordResetVerified(true);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    if (mode === ActionModes.EMAIL_VERIFICATION) {
      confirmEmailVerification();
    }
    if (mode === ActionModes.PASSWORD_RESET) {
      confirmPasswordReset();
    }
  }, [mode, oobCode]);

  return (
    <>
      {loading && (
        <Center>
          <Spinner />
        </Center>
      )}
      {error && (
        <Center>
          <Text> Error Occured. Please try again!</Text>
        </Center>
      )}
      {emailVerified && <ConfirmVerificationPage />}
      {passwordResetVerified && (
        <Center>
          {" "}
          <NewPassword oobCode={oobCode ?? ""} />{" "}
        </Center>
      )}
    </>
  );
};
export default Action;
