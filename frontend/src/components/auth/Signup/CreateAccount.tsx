import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import BackButton from "../../pages/Scheduling/BackButton";
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
  const { previous, next } = navigation;
  const history = useHistory();
  const { role, firstName, lastName, businessName, phoneNumber } = formData;

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

    if (role === Role.DONOR && !businessName) {
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
    if (validateForm()) {
      next();
    }
  };

  return (
    <Container pl="42px" pr="42px" pt={["2.75rem", "4rem"]}>
      <BackButton previous={previous} />
      <HeaderLabel text="Create an account" />
      <Text mt="1rem" textStyle="mobileSmall" color="hubbard.100">
        Account information can be edited later via the{" "}
        <Text as="span" textStyle="mobileBodyBold">
          My Account
        </Text>{" "}
        section of the platform.
        {role === Role.VOLUNTEER && (
          <Text>
            Please note there will be a few screening questions on the following
            pages, and your account will need to be accepted by CFKW Admin
            before you are able to sign up for shifts.
          </Text>
        )}
      </Text>

      <FormControl mt="2rem" isRequired>
        {role === Role.DONOR && (
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
        )}
        <Text
          mt="2rem"
          mb="0.5rem"
          textStyle="mobileBodyBold"
          color="hubbard.100"
        >
          {role === Role.VOLUNTEER
            ? "Volunteer information"
            : "Point of contact"}
        </Text>
        <Grid
          templateColumns={{ md: "repeat(2, 1fr)" }}
          columnGap={16}
          rowGap={4}
        >
          <Box>
            <FormControl isRequired isInvalid={!!formErrors.firstName}>
              <MandatoryInputDescription label="First name" />
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
          <Box>
            <FormControl isInvalid={!!formErrors.lastName}>
              <MandatoryInputDescription label="Last name" />
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
        </Grid>
        <Box mt="2rem">
          <FormControl isInvalid={!!formErrors.phoneNumber}>
            <MandatoryInputDescription label="Phone number" />
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
        <Box mt="2.5rem">
          <Button mt="2" variant="navigation" onClick={handleNext} width="100%">
            Next
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default CreateAccount;
