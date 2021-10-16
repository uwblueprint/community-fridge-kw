import { Container, Stack } from "@chakra-ui/react";
import React from "react";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";

const Default = (): React.ReactElement => {
  return (
    <Container centerContent>
      <h1>Community Fridge KW</h1>
      <Stack spacing={3} direction="row" align="center">
        <Logout />
        <RefreshCredentials />
        <ResetPassword />
      </Stack>
    </Container>
  );
};

export default Default;
