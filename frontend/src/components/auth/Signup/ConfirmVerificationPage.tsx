import { CloseIcon } from "@chakra-ui/icons";
import { Button, Container, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import confirmVerificationImage from "../../../assets/authentication_complete.svg";
import * as Routes from "../../../constants/Routes";

const ConfirmVerificationPage = () => {
  const history = useHistory();

  return (
    <Container variant="dashboardVariant">
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
