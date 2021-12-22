import { CloseIcon } from "@chakra-ui/icons";
import { Container, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { LANDING_PAGE } from "../../../constants/Routes";
import { SignUpFormProps } from "./types";

interface VerificationPageProps {
  formValues: SignUpFormProps;
}

const VerificationPage = ({ formValues }: VerificationPageProps) => {
  const history = useHistory();
  const { email } = formValues;
  return (
    <Container pl="42px" pr="42px" pt="31px">
      <IconButton
        aria-label="close page"
        float="right"
        backgroundColor="transparent"
        onClick={() => history.push(LANDING_PAGE)}
        display={{ md: "none" }}
      >
        <CloseIcon color="black.100" />
      </IconButton>
      <Container centerContent>
        <Text mt="2rem" textAlign="center" textStyle="mobileHeader1">
          Please verify your email address!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="mobileBody"
          color="hubbard.100"
        >
          We sent a verfication email to {email}. Please check your email to
          begin scheduling your first dropoff!
        </Text>
      </Container>
    </Container>
  );
};

export default VerificationPage;
