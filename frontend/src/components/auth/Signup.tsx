import {
  Box,
  Button,
  Center,
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

import authAPIClient from "../../APIClients/AuthAPIClient";
import {
  HOME_PAGE,
  LANDING_PAGE,
  VERIFICATION_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import Header from "../common/Header";
import { BackArrow, CheckmarkIcon, CloseIcon } from "../common/icons";
import { initialState, passwordVerificationReducer } from "./reducer";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "./utilities";

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [isFirstStep, setIsFirstStep] = useState(true);

  const [state, dispatch] = useReducer(
    passwordVerificationReducer,
    initialState(),
  );

  const history = useHistory();
  interface InputDescriptionProps {
    label: string;
  }

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

  const MandatoryInputDescription = ({
    label,
  }: InputDescriptionProps): JSX.Element => (
    <Box display="inline">
      <Text
        display="inline-block"
        textStyle="secondarySubheading"
        color="gray.300"
      >
        {label}
      </Text>{" "}
      <Text
        textStyle="secondarySubheading"
        display="inline-block"
        color="red.100"
      >
        *
      </Text>
    </Box>
  );

  const verifyPassword = (input: string) => {
    dispatch({
      type: "SET_IS_TWELVE_CHARS",
      isTwelveChars: checkLength(input),
    });
    dispatch({
      type: "SET_IS_UPPER_CASE",
      isUpperCase: checkForUpperCase(input),
    });
    dispatch({
      type: "SET_IS_LOWER_CASE",
      isLowerCase: checkForLowerCase(input),
    });
    dispatch({ type: "SET_IS_NUMBER", isNumber: checkForNumbers(input) });
    dispatch({
      type: "SET_IS_SPECIAL_CHAR",
      isSpecialChar: checkForSpecialCharacters(input),
    });

    setPassword(input);
  };

  const isCheckMarkOrClose = (isTrue: boolean) => {
    return isTrue ? <CheckmarkIcon /> : <CloseIcon color="#DF7676" />;
  };
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <>
      <Header />
      {isFirstStep ? (
        <Container pl="42px" pr="42px" pt="0.5rem">
          <IconButton
            float="right"
            aria-label="close sign up"
            onClick={() => history.push(LANDING_PAGE)}
            backgroundColor="transparent"
          >
            <CloseIcon color="#111111" />
          </IconButton>
          <Text mt="67px" textStyle="heading">
            Create an account
          </Text>
          <Text textStyle="secondarySubheading" color="gray.300">
            Account information can be edited in the Account section of the
            platform.
          </Text>
          <FormControl mt="2rem">
            <Box>
              <Text textStyle="subHeading" color="gray.300">
                Organization
              </Text>
              <MandatoryInputDescription label="Business Name" />
              <Input
                mt="2"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Enter name of business"
              />
            </Box>
            <Text mt="2rem" textStyle="subHeading" color="gray.300">
              Point of Contact
            </Text>
            <Box>
              <MandatoryInputDescription label="First Name" />
              <Input
                mt="2"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
              />
            </Box>
            <Box mt="1rem">
              <MandatoryInputDescription label="Last Name" />

              <Input
                mt="2"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last name"
              />
            </Box>
            <Box mt="1rem">
              <MandatoryInputDescription label="Phone Number" />
              <Input
                mt="2"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Enter phone number"
              />
            </Box>
            <Box mt="1rem">
              <Button
                mt="2"
                backgroundColor="black.100"
                color="white.100"
                size="md"
                w="100%"
                onClick={() => setIsFirstStep(false)}
              >
                Next
              </Button>
            </Box>
          </FormControl>
        </Container>
      ) : (
        <Container pl="42px" pr="42px" pt="0.5rem">
          <IconButton
            marginLeft="-12px"
            float="left"
            backgroundColor="transparent"
            aria-label="go back"
            onClick={() => setIsFirstStep(true)}
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
                onChange={(event) => setEmail(event.target.value)}
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
                  value={password}
                  onChange={(event) => verifyPassword(event.target.value)}
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
                <Center float="left">
                  {isCheckMarkOrClose(state.isTwelveChars)}

                  <Text>minimum of 12 characters as string </Text>
                </Center>

                <Center float="left">
                  {isCheckMarkOrClose(state.isUpperCase)}

                  <Text>at least 1 upper case letter</Text>
                </Center>

                <Center float="left">
                  {isCheckMarkOrClose(state.isLowerCase)}

                  <Text>at least 1 lower case letter</Text>
                </Center>

                <Center float="left">
                  {isCheckMarkOrClose(state.isNumber)}

                  <Text>at least 1 number</Text>
                </Center>

                <Center float="left">
                  {isCheckMarkOrClose(state.isSpecialChar)}

                  <Text>at least 1 symbol</Text>
                </Center>
              </Text>
            </Box>

            <Box mt="8rem">
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
      )}
    </>
  );
};

export default Signup;
