import { CloseIcon } from "@chakra-ui/icons";
import { Container, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import verificationEmailImage from "../../../assets/authentication_incomplete.svg";
import * as Routes from "../../../constants/Routes";
import { SignUpFormProps } from "./types";

interface VerificationPageProps {
  formValues: SignUpFormProps;
}

const VerificationPage = ({ formValues }: VerificationPageProps) => {
  const history = useHistory();
  const { email } = formValues;
  return (
    <Container dashboardVariant>
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
          width="70%"
          height="70%"
          src={verificationEmailImage}
          alt="Verification email image"
        />
        <Text mt="2rem" textAlign="center" textStyle="mobileHeader1">
          Please verify your email address!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="mobileBody"
          color="hubbard.100"
        >
          We sent a verification email to {email}. Please check your email to
          begin scheduling your first dropoff!
        </Text>
        <Text textAlign="center" textStyle="mobileBodyBold" mt="1rem">
          Please verify your email within the hour or you will need to contact
          admin for account creation.
        </Text>
      </Container>
    </Container>
  );
};

export default VerificationPage;
