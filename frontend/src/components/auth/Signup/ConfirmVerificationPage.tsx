import { CloseIcon } from "@chakra-ui/icons";
import { Button, Container, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import confirmVerificationImage from "../../../assets/authentication_complete.svg";
import * as Routes from "../../../constants/Routes";

const ConfirmVerificationPage = () => {
  const history = useHistory();

  return (
    <Container dashboardVariant pl="42px" pr="42px" pt="31px">
      <IconButton
        display={{ md: "none" }}
        aria-label="close page"
        float="right"
        backgroundColor="transparent"
        onClick={() => history.push(Routes.LANDING_PAGE)}
      >
        <CloseIcon color="black.100" />
      </IconButton>
      <Container centerContent>
        <Image
          width="80%"
          height="80%"
          src={confirmVerificationImage}
          alt="Verification email image"
        />
        <Text mt="1rem" textAlign="center" textStyle="mobileHeader1">
          Thank you for verifying your email address!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="mobileBody"
          color="hubbard.100"
        >
          Almost done! Click &ldquo;Finish&rdquo; to contine.
        </Text>
        <Button
          mt="2rem"
          width="100%"
          variant="navigation"
          onClick={() => history.push(Routes.DASHBOARD_PAGE)}
        >
          Finish
        </Button>
      </Container>
    </Container>
  );
};

export default ConfirmVerificationPage;
