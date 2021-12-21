import React from "react";
import ConfirmVerificationPage from "./Signup/ConfirmVerificationPage";
import AuthAPIClient from "../../APIClients/AuthAPIClient";

const Action = () => {
  // http://localhost:3000/action?mode=resetPassword&oobCode=ABC123&apiKey=AIzaSy

  // mode - The user management action to be completed
  // oobCode - A one-time code, used to identify and verify a request
  // apiKey - Your Firebase project's API key, provided for convenience

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");
  const apiKey = urlParams.get("apiKey");

  const confirmEmailVerification = async () => {
    const confirmEmailVerificationResponse = await AuthAPIClient.confirmEmailVerification(
      oobCode ?? "",
    );

    if (confirmEmailVerificationResponse) {
      alert("Email verification successful");
    }
  };
  React.useEffect(() => {
    confirmEmailVerification();
  }, []);
  return <ConfirmVerificationPage />;
};

export default Action;
