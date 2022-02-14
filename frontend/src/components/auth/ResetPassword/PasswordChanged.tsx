import { CloseIcon } from "@chakra-ui/icons";
import { Container, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import confirmVerificationImage from "../../../assets/authentication_complete.svg";
import * as Routes from "../../../constants/Routes";

const PasswordChanged = () => {
  const history = useHistory();
  return (
    <Container pl="42px" pr="42px" pt="31px">
      <IconButton
        aria-label="close page"
        float="right"
        backgroundColor="transparent"
        onClick={() => history.push(Routes.LANDING_PAGE)}
        display={{ md: "none" }}
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
        <Text mt="2rem" textAlign="center" textStyle="mobileHeader1">
          Your password has been changed!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="mobileBody"
          color="hubbard.100"
        >
          Your password has been changed!
        </Text>
      </Container>
    </Container>
  );
};

export default PasswordChanged;
