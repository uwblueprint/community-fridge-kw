import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import useViewport from "../../../hooks/useViewport";
import MandatoryInputDescription from "../Signup/components/MandatoryInputDescription";
import { RequestPasswordChangeFormProps } from "./types";

const ChangePassword = ({
  formData,
  setForm,
  navigation,
}: {
  formData: RequestPasswordChangeFormProps;
  setForm: SetForm;
  navigation: NavigationProps;
}) => {
  const { next } = navigation;
  const history = useHistory();

  const { isDesktop } = useViewport();
  const { email } = formData;

  const [interaction, setInteraction] = React.useState({
    email: false,
  });

  const onSendRequestClick = async () => {
    if (!email) {
      setInteraction({ ...interaction, email: true });
      return false;
    }
    await authAPIClient.resetPassword(email);
    return next();
  };

  return (
    <Container pl="42px" pr="42px" pt={["3rem", "0.5rem"]}>
      <Text mt="67px" textStyle={["mobileHeader3", "desktopHeader3"]}>
        Change Password
      </Text>
      <Text
        textStyle={["mobileSmall", "desktopSmall"]}
        color="hubbard.100"
        mt="1rem"
      >
        Enter the email you registered with to send a password change request.
      </Text>

      <FormControl
        mt={["2rem", "2.75rem"]}
        isInvalid={!email && interaction.email}
      >
        <Box>
          <MandatoryInputDescription label="Enter the email address you registered with" />
          <Input
            mt="2"
            value={email}
            onChange={(e) => {
              setInteraction({ ...interaction, email: true });
              setForm(e);
            }}
            name="email"
            placeholder="Enter email address"
          />
          <FormErrorMessage>
            Please enter a valid email address.
          </FormErrorMessage>
        </Box>
        <Box mt={["3rem", "3.5rem"]}>
          <Button
            mt="2"
            variant="navigation"
            onClick={onSendRequestClick}
            width="100%"
            size="lg"
          >
            Send password change request
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default ChangePassword;
