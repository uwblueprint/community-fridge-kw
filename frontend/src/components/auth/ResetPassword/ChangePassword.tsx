import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
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
  const { authenticatedUser } = useContext(AuthContext);

  const { isDesktop } = useViewport();
  const { email } = formData;

  const [interaction, setInteraction] = React.useState({
    email: false,
  });

  const onSendRequestClick = async () => {
    if (!email) {
      setInteraction({ ...interaction, email: true });
    }
    if (!email) {
      return false;
    }
    await authAPIClient.resetPassword(email);
    return next();
  };

  return (
    <div>
      <Container pl="42px" pr="42px" pt="0.5rem">
        {!isDesktop && (
          <IconButton
            float="right"
            aria-label="close sign up"
            onClick={() => history.push(Routes.LOGIN_PAGE)}
            backgroundColor="transparent"
          >
            <CloseIcon color="black.100" />
          </IconButton>
        )}
        <Text mt="67px" textStyle="mobileHeader1">
          Change Password
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100">
          Enter the email you registered with to send a password change request.
        </Text>

        <FormControl mt="2rem" isInvalid={!email && interaction.email}>
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
          <Box mt="3rem">
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
    </div>
  );
};

export default ChangePassword;
