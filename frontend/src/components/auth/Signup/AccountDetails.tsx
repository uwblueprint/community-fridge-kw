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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useReducer, useState } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { Redirect, useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import {
  DASHBOARD_PAGE,
  LANDING_PAGE,
  LOGIN_PAGE,
  VERIFICATION_PAGE,
} from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import {
  initialState,
  passwordVerificationReducer,
} from "../../../reducers/PasswordVerificationReducer";
import { AuthenticatedUser } from "../../../types/AuthTypes";
import { BackArrow, CloseIcon } from "../../common/icons";
import {
  checkForLowerCase,
  checkForNumbers,
  checkForSpecialCharacters,
  checkForUpperCase,
  checkLength,
} from "../utilities";
import MandatoryInputDescription from "./components/MandatoryInputDescription";
import PasswordRequirement from "./components/PasswordRequirement";
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
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  const { previous } = navigation;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    confirmPassword,
    businessName,
    password,
    role,
  } = formValues;
  const [showPassword, setShowPassword] = useState(false);

  const [tempPassword, setTempPassword] = React.useState("");
  const [interaction, setInteraction] = React.useState({
    email: false,
    password: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSignupClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      businessName,
      role,
    );
    if (!user) {
      onOpen();
      return false;
    }
    setAuthenticatedUser(user);

    return history.push(VERIFICATION_PAGE);
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

    const { isTwelveChars, isUpperCase, isLowerCase, isNumber } = state;

    if (isTwelveChars && isUpperCase && isLowerCase && isNumber) {
      return true;
    }
    return false;
  };

  if (authenticatedUser) {
    return <Redirect to={DASHBOARD_PAGE} />;
  }

  return (
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
      <Text mt="67px" textStyle="mobileHeader1">
        Account details
      </Text>
      <FormControl mt="2rem" isInvalid={!email && interaction.email}>
        <Box>
          <MandatoryInputDescription label="Email Address" />
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
        <MandatoryInputDescription label="Password" />

        <FormControl isInvalid={!password && interaction.password}>
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
                  setForm(event);
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
          <FormErrorMessage>Please enter a valid password.</FormErrorMessage>
        </FormControl>
      </Box>

      <FormControl isInvalid={confirmPassword !== tempPassword}>
        <Box mt="2rem">
          <MandatoryInputDescription label="Confirm password" />
          <Input
            mt="2"
            type="password"
            value={confirmPassword}
            onChange={setForm}
            name="confirmPassword"
            placeholder="Re-enter password"
          />
          <FormErrorMessage>Passwords do not match.</FormErrorMessage>
        </Box>
        <Box mt="3rem">
          <Button mt="2" variant="navigation" onClick={onSignupClick}>
            Next
          </Button>
        </Box>
      </FormControl>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody">
            Sorry, something went wrong. Please try again later and check all
            fields have correct formatting.
          </ModalBody>

          <ModalFooter>
            <Button
              width="100%"
              color="squash.100"
              backgroundColor="raddish.100"
              mr={3}
              onClick={() => history.push(LOGIN_PAGE)}
            >
              Return to Log In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AccountDetails;
