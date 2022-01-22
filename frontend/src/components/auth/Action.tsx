import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";

enum EmailVerificationResponse {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

const Action = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");
  const [emailVerified, setEmailVerified] = React.useState("");

  const confirmEmailVerification = async () => {
    const confirmEmailVerificationResponse = await AuthAPIClient.confirmEmailVerification(
      oobCode ?? "",
    );
    if (confirmEmailVerificationResponse) {
      setEmailVerified(EmailVerificationResponse.SUCCESS);
    } else {
      setEmailVerified(EmailVerificationResponse.FAILURE);
    }
  };
  React.useEffect(() => {
    confirmEmailVerification();
  }, []);

  if (emailVerified === EmailVerificationResponse.SUCCESS) {
    return <ConfirmVerificationPage />;
  }

  if (emailVerified === "") {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return <Center>Sorry, there was a problem verifying the email.</Center>;
};
export default Action;
