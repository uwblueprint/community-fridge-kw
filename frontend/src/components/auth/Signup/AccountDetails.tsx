import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import * as Routes from "../../../constants/Routes";
import useViewport from "../../../hooks/useViewport";
import { AuthenticatedUser, Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";
import MandatoryInputDescription from "./components/MandatoryInputDescription";
import PasswordRequirement from "./components/PasswordRequirement";
import FailedModal from "./FailedModal";
import { SignUpFormProps } from "./types";

const AccountDetails = ({
  formValues,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formValues: SignUpFormProps;
  setForm: SetForm;
}) => {
  const history = useHistory();
  const { previous, next } = navigation;
  const { isDesktop } = useViewport();
  const {
    role,
    firstName,
    lastName,
    email,
    phoneNumber,
    confirmPassword,
    businessName,
    password,
  } = formValues;
  const [showPassword, setShowPassword] = useState(false);

  const [tempPassword, setTempPassword] = React.useState("");
  const [interaction, setInteraction] = React.useState({
    email: false,
    password: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getSignupRole = (signupEmail: string) => {
    if (
      signupEmail === "communityfridgekw@gmail.com" ||
      signupEmail.match("^[A-Za-z0-9._%+-]+@uwblueprint.org")
    ) {
      return Role.ADMIN;
    }
    return role;
  };

  const onSignupClick = async () => {
    if (!email) {
      setInteraction({ ...interaction, email: true });
    }
    if (!password) {
      setInteraction({ ...interaction, password: true });
    }
    if (!password || !email || password !== confirmPassword) {
      return false;
    }
    const updatedRole = await getSignupRole(email);

    if (updatedRole !== Role.VOLUNTEER) {
      const user: AuthenticatedUser = await authAPIClient.register(
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        businessName,
        updatedRole,
      );
      if (!user) {
        onOpen();
        return false;
      }
    }
    return next();
  };

  const verifyPassword = (input: string) => {
    if (
      checkLength(input) &&
      checkForLowerCase(input) &&
      checkForUpperCase(input) &&
      checkForNumbers(input) &&
      checkForSpecialCharacters(input)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Container pl="42px" pr="42px" pt="0.5rem">
      <IconButton
        marginLeft="-12px"
        float="left"
        backgroundColor="transparent"
        aria-label="go back"
        onClick={previous}
      >
        <ArrowBackIcon width="24px" height="24px" />
      </IconButton>

      {!isDesktop && (
        <>
          <IconButton
            float="right"
            marginRight="-12px"
            aria-label="close sign up"
            onClick={() => history.push(Routes.LANDING_PAGE)}
            backgroundColor="transparent"
          >
            <CloseIcon color="black.100" />
          </IconButton>
        </>
      )}
      <HeaderLabel text="Account details" isDesktop={isDesktop} />
      <FormControl mt="2rem" isInvalid={!email && interaction.email}>
        <Box>
          <MandatoryInputDescription label="Email address" />
          <Input
            mt="2"
            value={email}
            onChange={(e) => {
              setInteraction({ ...interaction, email: true });
              setForm(e);
            }}
            name="email"
            placeholder="i.e. janedoe@gmail.com"
          />
          <FormErrorMessage>
            Please enter a valid email address.
          </FormErrorMessage>
        </Box>
      </FormControl>

      <Box mt="1rem">
        <MandatoryInputDescription label="New password" />

        <FormControl isInvalid={!tempPassword && interaction.password}>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              value={tempPassword}
              onChange={(event) => {
                setInteraction({ ...interaction, password: true });
                setTempPassword(event.target.value);
                if (verifyPassword(event?.target.value)) {
                  setForm({
                    target: { name: "password", value: event.target.value },
                  });
                }
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Text mt="1rem" textStyle="mobileSmall" color="hubbard.100">
            <Text>Password Requirements: </Text>
            <Stack alignItems="start" spacing="0">
              <PasswordRequirement
                state={checkLength(tempPassword)}
                label="minimum of 12 characters"
              />
              <PasswordRequirement
                state={checkForUpperCase(tempPassword)}
                label="at least 1 upper case letter"
              />
              <PasswordRequirement
                state={checkForLowerCase(tempPassword)}
                label="at least 1 lower case letter"
              />
              <PasswordRequirement
                state={checkForNumbers(tempPassword)}
                label="at least 1 number"
              />
              <PasswordRequirement
                state={checkForSpecialCharacters(tempPassword)}
                label="at least 1 special character"
              />
            </Stack>
          </Text>
          <FormErrorMessage>Please enter a valid password.</FormErrorMessage>
        </FormControl>
      </Box>

      <FormControl isInvalid={confirmPassword !== tempPassword}>
        <Box mt="2rem">
          <MandatoryInputDescription label="Confirm password" />
          <Input
            mt="2"
            type="password"
            onChange={setForm}
            name="confirmPassword"
            placeholder="Re-enter password"
          />
          <FormErrorMessage>Passwords do not match.</FormErrorMessage>
        </Box>
        <Box mt="3rem">
          <Button
            mt="2"
            variant="navigation"
            onClick={onSignupClick}
            width="100%"
          >
            Next
          </Button>
        </Box>
      </FormControl>
      <FailedModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default AccountDetails;
