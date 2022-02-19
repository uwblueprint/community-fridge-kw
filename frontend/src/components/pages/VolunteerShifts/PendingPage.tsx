import { Container, Text } from "@chakra-ui/react";
import React from "react";

const PendingPage = () => {
  return (
    <Container centerContent variant="responsiveContainer">
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        mt="2em"
      >
        Pending account approval
      </Text>
      <Text
        textStyle="mobileBody"
        mt="1em"
        color="hubbard.100"
        fontWeight="bold"
      >
        We’re evaluating your profile!
      </Text>
      <Text textStyle="mobileBody" textAlign="center" mt="1em" color="hubbard.100">
        Check back soon to see if your profile has been approved. You will also
        receive a welcome email when you have been approved!
      </Text>
    </Container>
  );
};

export default PendingPage;