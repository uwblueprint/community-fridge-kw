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
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import useViewport from "../../../hooks/useViewport";
import MandatoryInputDescription from "../Signup/components/MandatoryInputDescription";
import PasswordRequirement from "../Signup/components/PasswordRequirement";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";
import { ResetPasswordChangeFormProps } from "./types";

const NewPassword = ({
  formValues,
  setForm,
  navigation,
}: {
  formValues: ResetPasswordChangeFormProps;
  setForm: SetForm;
  navigation: NavigationProps;
}) => {
  const { next } = navigation;
  const history = useHistory();

  const { isDesktop } = useViewport();

  const { confirmPassword, password } = formValues;
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = React.useState("");
  const [interaction, setInteraction] = React.useState({
    password: false,
  });

  const onResetClick = async () => {
    if (!password) {
      setInteraction({ ...interaction, password: true });
    }
    if (!password || password !== confirmPassword) {
      return false;
    }
    // todo: reset password api call await authAPIClient
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
    <div>
      <Container pl="42px" pr="42px" pt="0.5rem">
        <Text mt="67px" textStyle="mobileHeader1">
          New password
        </Text>

        <Box mt="1rem">
          <FormControl isInvalid={!tempPassword && interaction.password}>
            <Text
              mt="1rem"
              mb="1rem"
              textStyle="mobileSmall"
              color="hubbard.100"
            >
              <Text>Password Requirements: </Text>
              <Stack alignItems="start" spacing="0">
                <PasswordRequirement
                  state={checkLength(tempPassword)}
                  label="minimum of 12 characters as string"
                />
                <PasswordRequirement
                  state={checkForUpperCase(tempPassword)}
                  label="at least 1 uppercase letter"
                />
                <PasswordRequirement
                  state={checkForLowerCase(tempPassword)}
                  label="at least 1 lowercase letter"
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

            <MandatoryInputDescription label="New Password" />
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
              onClick={onResetClick}
              width="100%"
            >
              Next
            </Button>
          </Box>
        </FormControl>
      </Container>
    </div>
  );
};

export default NewPassword;
