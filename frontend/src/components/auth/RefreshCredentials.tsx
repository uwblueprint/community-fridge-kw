import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const onRefreshClick = async () => {
    const success = await authAPIClient.refresh();
    if (!success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <Button colorScheme="blue" variant="solid" onClick={onRefreshClick}>
      Refresh Credentials
    </Button>
  );
};

export default RefreshCredentials;
