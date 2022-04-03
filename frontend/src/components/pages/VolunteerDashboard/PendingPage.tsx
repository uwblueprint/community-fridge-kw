import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";

const PendingPage = () => {
  const history = useHistory();
  const navigateToDashboard = () => {
    history.push(Routes.LANDING_PAGE);
  };

  return (
    <Container variant="baseContainer">
      <Box mt={10}>
        <Button
          onClick={navigateToDashboard}
          paddingLeft="0"
          backgroundColor="transparent"
        >
          <ArrowBackIcon w={8} h={5} /> Back
        </Button>
      </Box>
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        textAlign="center"
        mt="2em"
      >
        Pending account approval
      </Text>
      <Text
        textStyle="mobileBody"
        textAlign="center"
        mt="1em"
        color="hubbard.100"
        fontWeight="bold"
      >
        We’re evaluating your profile!
      </Text>
      <Text
        textStyle="mobileBody"
        textAlign="center"
        mt="1em"
        color="hubbard.100"
      >
        You will receive an email when your account has been approved!
      </Text>
    </Container>
  );
};

export default PendingPage;
