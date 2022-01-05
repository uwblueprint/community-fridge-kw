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
  useMediaQuery,
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

        <Text
          mt="2rem"
          mb="0.5rem"
          textStyle="mobileBodyBold"
          color="hubbard.100"
        >
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
          <Button
            mt="1.5"
            variant="navigation"
            onClick={checkValidation}
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
