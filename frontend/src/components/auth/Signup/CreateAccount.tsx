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
import { Redirect, useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import useViewport from "../../../hooks/useViewport";
import MandatoryInputDescription from "./components/MandatoryInputDescription";
import { SignUpFormProps } from "./types";

const CreateAccount = ({
  formData,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formData: SignUpFormProps;
  setForm: SetForm;
}) => {
  const { next } = navigation;
  const history = useHistory();
  const { firstName, lastName, businessName, phoneNumber } = formData;
  const { authenticatedUser } = useContext(AuthContext);

  const { isDesktop } = useViewport();

  const errorMessages = {
    businessName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };
  const [formErrors, setFormErrors] = React.useState(errorMessages);

  const validateForm = () => {
    const newErrors = {
      businessName: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };
    let valid = true;

    if (!businessName) {
      valid = false;
      newErrors.businessName = "Please enter the name of your business.";
    }
    if (!firstName) {
      valid = false;
      newErrors.firstName = "Please enter a first name.";
    }
    if (!lastName) {
      valid = false;
      newErrors.lastName = "Please enter a last name.";
    }
    if (!phoneNumber) {
      valid = false;
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }
    setFormErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    console.log("here");
    if (validateForm()) {
      next();
    }
  };

  if (authenticatedUser) {
    return <Redirect to={Routes.DASHBOARD_PAGE} />;
  }
  return (
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
        Create an account
      </Text>
      <Text textStyle="mobileSmall" color="hubbard.100">
        Account information can be edited in the My Account section of the
        platform.
      </Text>

      <FormControl mt="2rem" isRequired>
        <Box>
          <Text mb="0.5rem" textStyle="mobileBodyBold" color="hubbard.100">
            Organization
          </Text>
          <MandatoryInputDescription label="Name of Business" />
          <FormControl isRequired isInvalid={!!formErrors.businessName}>
            <Input
              validate="Required"
              mt="2"
              value={businessName}
              onChange={setForm}
              name="businessName"
              placeholder="i.e. Lettuce Garden"
            />
            <FormErrorMessage>{formErrors.businessName}</FormErrorMessage>
          </FormControl>
        </Box>

        <Text
          mt="2rem"
          mb="0.5rem"
          textStyle="mobileBodyBold"
          color="hubbard.100"
        >
          Point of Contact
        </Text>
        <Box>
          <FormControl isRequired isInvalid={!!formErrors.firstName}>
            <MandatoryInputDescription label="First Name" />
            <Input
              mt="2"
              value={firstName}
              onChange={setForm}
              name="firstName"
              placeholder="i.e. Jane"
            />
            <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <FormControl isInvalid={!!formErrors.lastName}>
            <MandatoryInputDescription label="Last Name" />
            <Input
              mt="2"
              value={lastName}
              onChange={setForm}
              name="lastName"
              placeholder="i.e. Doe"
            />
            <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <FormControl isInvalid={!!formErrors.phoneNumber}>
            <MandatoryInputDescription label="Phone Number" />
            <Input
              mt="2"
              type="tel"
              value={phoneNumber}
              name="phoneNumber"
              onChange={setForm}
              placeholder="i.e. 999-999-999"
            />
            <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <Button
            mt="1.5"
            variant="navigation"
            onClick={handleNext}
            width="100%"
          >
            Next
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default CreateAccount;
