import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { LOGIN_PAGE } from "../../../constants/Routes";
import { CloseIcon } from "../../common/icons";
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
  const [interaction, setInteraction] = React.useState({
    businessName: false,
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });

  const checkValidation = () => {
    if (!businessName) {
      setInteraction({ ...interaction, businessName: true });
    }
    if (!firstName) {
      setInteraction({ ...interaction, firstName: true });
    }
    if (!lastName) {
      setInteraction({ ...interaction, lastName: true });
    }
    if (!phoneNumber) {
      setInteraction({ ...interaction, phoneNumber: true });
    }
    if (businessName && firstName && lastName && phoneNumber) {
      next();
    }
  };
  return (
    <Container pl="42px" pr="42px" pt="0.5rem">
      <IconButton
        float="right"
        aria-label="close sign up"
        onClick={() => history.push(LOGIN_PAGE)}
        backgroundColor="transparent"
      >
        <CloseIcon color="#111111" />
      </IconButton>
      <Text mt="67px" textStyle="mobileHeader1">
        Create an account
      </Text>
      <Text textStyle="mobileSmall" color="hubbard.100">
        Account information can be edited in the Account section of the
        platform.
      </Text>

      <FormControl mt="2rem" isRequired>
        <Box>
          <Text textStyle="mobileBodyBold" color="hubbard.100">
            Organization
          </Text>
          <MandatoryInputDescription label="Name of Business" />
          <FormControl isInvalid={!businessName && interaction.businessName}>
            <Input
              validate="Required"
              mt="2"
              value={businessName}
              onChange={(e) => {
                setForm(e);
                setInteraction({ ...interaction, businessName: true });
              }}
              name="businessName"
              placeholder="i.e. Lettuce Garden"
            />
            <FormErrorMessage>
              Please enter the name of your business.
            </FormErrorMessage>
          </FormControl>
        </Box>

        <Text mt="2rem" textStyle="mobileBodyBold" color="hubbard.100">
          Point of Contact
        </Text>
        <Box>
          <FormControl isInvalid={!firstName && interaction.firstName}>
            <MandatoryInputDescription label="First Name" />
            <Input
              mt="2"
              value={firstName}
              onChange={(e) => {
                setForm(e);
                setInteraction({ ...interaction, firstName: true });
              }}
              name="firstName"
              placeholder="i.e. Jane"
            />
            <FormErrorMessage>Please enter a first name.</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <FormControl isInvalid={!lastName && interaction.lastName}>
            <MandatoryInputDescription label="Last Name" />
            <Input
              mt="2"
              value={lastName}
              onChange={(e) => {
                setForm(e);
                setInteraction({ ...interaction, lastName: true });
              }}
              name="lastName"
              placeholder="i.e. Doe"
            />
            <FormErrorMessage>Please enter a last name.</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <FormControl isInvalid={!phoneNumber && interaction.phoneNumber}>
            <MandatoryInputDescription label="Phone Number" />
            <Input
              mt="2"
              type="tel"
              value={phoneNumber}
              name="phoneNumber"
              onChange={(e) => {
                setForm(e);
                setInteraction({ ...interaction, phoneNumber: true });
              }}
              placeholder="i.e. 999-999-999"
            />
            <FormErrorMessage>
              Please enter a valid phone number.
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1rem">
          <Button mt="2" variant="authNavigation" onClick={checkValidation}>
            Next
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default CreateAccount;
