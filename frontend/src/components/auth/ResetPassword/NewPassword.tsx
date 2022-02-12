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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import AuthAPIClient from "../../../APIClients/AuthAPIClient";
import * as Routes from "../../../constants/Routes";
import MandatoryInputDescription from "../Signup/components/MandatoryInputDescription";
import PasswordRequirement from "../Signup/components/PasswordRequirement";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";

const NewPassword = ({ oobCode }: { oobCode: string }) => {
  const history = useHistory();
  const [{ password, confirmPassword }, setValue] = useForm({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const errorMessages = {
    password: "",
  };
  const [formErrors, setFormErrors] = React.useState(errorMessages);

  const validatePassword = () => {
    const newErrors = {
      password: "",
    };
    let valid = true;

    if (
      !password ||
      !checkLength(password) ||
      !checkForLowerCase(password) ||
      !checkForUpperCase(password) ||
      !checkForNumbers(password) ||
      !checkForSpecialCharacters(password)
    ) {
      valid = false;
      newErrors.password = "Please enter a valid password.";
    }

    setFormErrors(newErrors);
    return valid;
  };

  const onResetClick = async () => {
    if (!validatePassword()) {
      return false;
    }

    const res = await AuthAPIClient.confirmPasswordReset(oobCode, password);

    if (res) {
      return history.push(Routes.LOGIN_PAGE);
    }

    return "";
  };

  return (
    <Container pl="42px" pr="42px" pt="0.5rem">
      <Text mt="67px" textStyle="mobileHeader1">
        New password
      </Text>

      <Box mt="1rem">
        <FormControl isInvalid={!!formErrors.password}>
          <Text mt="1rem" mb="1rem" textStyle="mobileSmall" color="hubbard.100">
            <Text>Password Requirements: </Text>
            <Stack alignItems="start" spacing="0">
              <PasswordRequirement
                state={checkLength(password)}
                label="minimum of 12 characters as string"
              />
              <PasswordRequirement
                state={checkForUpperCase(password)}
                label="at least 1 uppercase letter"
              />
              <PasswordRequirement
                state={checkForLowerCase(password)}
                label="at least 1 lowercase letter"
              />
              <PasswordRequirement
                state={checkForNumbers(password)}
                label="at least 1 number"
              />
              <PasswordRequirement
                state={checkForSpecialCharacters(password)}
                label="at least 1 special character"
              />
            </Stack>
          </Text>

          <MandatoryInputDescription label="New Password" />
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={setValue}
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

          <FormErrorMessage>Please enter a valid password.</FormErrorMessage>
        </FormControl>
      </Box>

      <FormControl isInvalid={confirmPassword !== password}>
        <Box mt="2rem">
          <MandatoryInputDescription label="Confirm password" />
          <Input
            mt="2"
            type="password"
            onChange={setValue}
            name="confirmPassword"
            placeholder="Re-enter password"
          />
          <FormErrorMessage>Passwords do not match.</FormErrorMessage>
        </Box>
        <Box mt="3rem">
          <Button
            mt="2"
            variant="navigation"
            onClick={onResetClick}
            width="100%"
          >
            Finish
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default NewPassword;
