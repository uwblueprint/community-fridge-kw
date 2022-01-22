import { CloseIcon } from "@chakra-ui/icons";
import { Container, IconButton, Text, Image } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import { RequestPasswordChangeFormProps } from "./types";

interface VerificationPageProps {
  formValues: RequestPasswordChangeFormProps;
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
        onClick={() => history.push(Routes.LANDING_PAGE)}
        display={{ md: "none" }}
      >
        <CloseIcon color="black.100" />
      </IconButton>
      <Container centerContent>
        {/* todo: replace image */}
        <Image
          objectFit="none"
          src="header-logo.png"
          alt="Community Fridge logo"
          display="inline"
        />
        <Text mt="2rem" textAlign="center" textStyle="mobileHeader1">
          Please check your email for next steps!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="mobileBody"
          color="hubbard.100"
        >
          We sent a password change request through email to {email}. Please check your email for further information.
        </Text>
      </Container>
    </Container>
  );
};

export default VerificationPage;
