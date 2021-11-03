import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { LANDING_PAGE } from "../../../constants/Routes";
import Header from "../../common/Header";
import { CloseIcon } from "../../common/icons";
import { MandatoryInputDescription } from "./components";

const CreateAccount = ({
  formData,
  setForm,
  navigation,
}: {
  navigation: any;
  formData: any;
  setForm: any;
}) => {
  const { next } = navigation;
  const history = useHistory();
  const { firstName, lastName, businessName, phoneNumber } = formData;

  return (
    <>
      <Header />
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
              onChange={setForm}
              name="businessName"
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
              onChange={setForm}
              name="firstName"
              placeholder="Enter first name"
            />
          </Box>
          <Box mt="1rem">
            <MandatoryInputDescription label="Last Name" />

            <Input
              mt="2"
              value={lastName}
              onChange={setForm}
              name="lastName"
              placeholder="Enter last name"
            />
          </Box>
          <Box mt="1rem">
            <MandatoryInputDescription label="Phone Number" />
            <Input
              mt="2"
              type="tel"
              value={phoneNumber}
              name="phoneNumber"
              onChange={setForm}
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
              onClick={() => {
                console.log("hay");
                next();
              }}
            >
              Next
            </Button>
          </Box>
        </FormControl>
      </Container>
    </>
  );
};

export default CreateAccount;
