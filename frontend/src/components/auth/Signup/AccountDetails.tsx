import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useReducer, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import {
  HOME_PAGE,
  LANDING_PAGE,
  VERIFICATION_PAGE,
} from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { AuthenticatedUser } from "../../../types/AuthTypes";
import Header from "../../common/Header";
import { BackArrow, CloseIcon } from "../../common/icons";
import { initialState, passwordVerificationReducer } from "../reducer";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";
import { MandatoryInputDescription, PasswordRequirement } from "./components";

const AccountDetails = ({
  formValues,
  setForm,
  navigation,
}: {
  navigation: any;
  formValues: any;
  setForm: any;
}) => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const history = useHistory();
  const { previous } = navigation;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    confirmPassword,
    password,
  } = formValues;
  const [showPassword, setShowPassword] = useState(false);

  console.log("render account details!");
  const onSignupClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    );
    setAuthenticatedUser(user);
    history.push(VERIFICATION_PAGE);
  };

  const [state, dispatch] = useReducer(
    passwordVerificationReducer,
    initialState(),
  );

  const verifyPassword = (input: string) => {
    dispatch({
      type: "CHECK_PASSWORD_REQUIREMENTS",
      isTwelveChars: checkLength(input),
      isUpperCase: checkForUpperCase(input),
      isLowerCase: checkForLowerCase(input),
      isNumber: checkForNumbers(input),
      isSpecialChar: checkForSpecialCharacters(input),
    });
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <>
      <Header />
      <Container pl="42px" pr="42px" pt="0.5rem">
        <IconButton
          marginLeft="-12px"
          float="left"
          backgroundColor="transparent"
          aria-label="go back"
          onClick={previous}
        >
          <BackArrow />
        </IconButton>
        <IconButton
          float="right"
          marginRight="-12px"
          aria-label="close sign up"
          onClick={() => history.push(LANDING_PAGE)}
          backgroundColor="transparent"
        >
          <CloseIcon color="#111111" />
        </IconButton>
        <Text mt="67px" textStyle="heading">
          Account details
        </Text>
        <FormControl mt="2rem">
          <Box>
            <MandatoryInputDescription label="Email Address" />
            <Input
              mt="2"
              value={email}
              onChange={setForm}
              name="email"
              placeholder="Enter email"
            />
          </Box>
          <Box mt="1rem">
            <MandatoryInputDescription label="Password" />

            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                name="password"
                value={password}
                onChange={(event) => {
                  verifyPassword(event?.target.value);
                  setForm(event);
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

            <Text mt="1rem" textStyle="secondarySubheading" color="gray.300">
              <Text>Password Requirements: </Text>
              <Stack alignItems="start" spacing="0">
                <PasswordRequirement
                  state={state.isTwelveChars}
                  label="minimum of 12 characters as string"
                />
                <PasswordRequirement
                  state={state.isUpperCase}
                  label="at least 1 uppercase letter"
                />
                <PasswordRequirement
                  state={state.isLowerCase}
                  label="at least 1 lowercase letter"
                />
                <PasswordRequirement
                  state={state.isNumber}
                  label="at least 1 number"
                />
                <PasswordRequirement
                  state={state.isSpecialChar}
                  label="at least 1 special character"
                />
              </Stack>
            </Text>
          </Box>

          <Box mt="2rem">
            <MandatoryInputDescription label="Confirm password" />
            <Input
              mt="2"
              value={confirmPassword}
              onChange={setForm}
              name="confirmPassword"
              placeholder="Re-enter password"
            />
          </Box>
          <Box mt="4rem">
            <Button
              mt="2"
              backgroundColor="black.100"
              color="white.100"
              size="md"
              w="100%"
              onClick={onSignupClick}
            >
              Next
            </Button>
          </Box>
        </FormControl>
      </Container>
    </>
  );
};

export default AccountDetails;
