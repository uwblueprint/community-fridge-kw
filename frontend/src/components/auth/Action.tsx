import { Center } from "@chakra-ui/react";
import React from "react";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";

const Action = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");
  const [emailVerified, setEmailVerified] = React.useState(false);

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

  return emailVerified ? (
    <ConfirmVerificationPage />
  ) : (
    <Center>Sorry, there was a problem verifying the email.</Center>
  );
};
export default Action;
