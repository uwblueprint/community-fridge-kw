import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import { SignupErrorMessage } from "../../../constants/AuthConstants";
import { AuthenticatedUser, Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import BackButton from "../../pages/Scheduling/BackButton";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";
import MandatoryInputDescription from "./components/MandatoryInputDescription";
import PasswordRequirement from "./components/PasswordRequirement";
import FailedModal from "./ReturnToLoginModal";
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
  const { previous, go } = navigation;
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
    return (
      go &&
      (role === Role.VOLUNTEER
        ? go("volunteer questions")
        : go("email verification"))
    );
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
    <Container pl="42px" pr="42px" pt={["2.75rem", "4rem"]}>
      <BackButton previous={previous} />
      <HeaderLabel text="Account details" />
      <FormControl mt="2rem" isInvalid={!email && interaction.email}>
        <Box>
          <MandatoryInputDescription label="Email address" />
          <Input
            mt="2"
            value={email}
            onChange={(e) => {
              setInteraction({ ...interaction, email: true });
              setForm({
                target: { name: "email", value: e.target.value.trim() },
              });
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
      <FailedModal
        errorHeader={SignupErrorMessage.HEADER}
        errorMessage={SignupErrorMessage.BODY}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Container>
  );
};

export default AccountDetails;
