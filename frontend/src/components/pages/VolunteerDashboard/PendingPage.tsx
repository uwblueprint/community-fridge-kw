import { Image, Container, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import pendingImage from "../../../assets/pending.svg";
import * as Routes from "../../../constants/Routes";

const PendingPage = () => {
  const history = useHistory();
  const navigateToDashboard = () => {
    history.push(Routes.LANDING_PAGE);
  };

  return (
    <Container variant="responsiveContainer">
      <Container centerContent>
        <Text
          textStyle={{ base: "mobileHeader3", md: "desktopHeader3" }}
          textAlign="center"
          mt="2em"
        >
          Pending account approval
        </Text>
        <Image
          width="80%"
          height="80%"
          src={pendingImage}
          alt="pending approval image"
        />
        <Text
          textStyle="mobileHeader4"
          textAlign="center"
          mt="1rem"
          color="black.100"
          fontWeight="bold"
        >
          We’re evaluating your profile!
        </Text>
        <Text
          textStyle="mobileSmall"
          textAlign="center"
          mt="1em"
          color="hubbard.100"
        >
          You will receive an email when your account has been approved!
        </Text>
      </Container>
    </Container>
  );
};

export default PendingPage;
