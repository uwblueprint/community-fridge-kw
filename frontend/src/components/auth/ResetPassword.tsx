import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  const onResetPasswordClick = async () => {
    await authAPIClient.resetPassword(authenticatedUser?.email);
  };

  return (
    <Button
      variant="solid"
      colorScheme="blackAlpha"
      onClick={onResetPasswordClick}
    >
      Reset Password
    </Button>
  );
};

export default ResetPassword;
