import { CloseIcon } from "@chakra-ui/icons";
import { Button, Container, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { DASHBOARD_PAGE, LANDING_PAGE } from "../../../constants/Routes";

const ConfirmVerificationPage = () => {
  const history = useHistory();

  return (
    <Container centerContent pl="42px" pr="42px" pt="31px">
      <IconButton
        display={{ md: "none" }}
        aria-label="close page"
        float="right"
        backgroundColor="transparent"
        onClick={() => history.push(LANDING_PAGE)}
      >
        <CloseIcon color="black.100" />
      </IconButton>
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
        onClick={() => history.push(DASHBOARD_PAGE)}
      >
        Finish
      </Button>
    </Container>
  );
};

export default ConfirmVerificationPage;
