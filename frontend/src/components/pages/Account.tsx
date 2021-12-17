import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import DonorAPIClient from "../../APIClients/DonorAPIClient";
import { DASHBOARD_PAGE, LOGIN_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const Account = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [businessName, setBusinessName] = useState("");

  const navigateToDashboard = () => {
    history.push(DASHBOARD_PAGE);
  };

  React.useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    const getDonor = async () => {
      const donor = await DonorAPIClient.getDonorByUserId(authenticatedUser.id);
      setBusinessName(donor.businessName);
    };
    getDonor();
  }, [authenticatedUser]);

  if (!authenticatedUser) {
    return <Redirect to={LOGIN_PAGE} />;
  }

  return (
    <Container
      centerContent
      pl="42px"
      pr="42px"
      pt="0.5rem"
      maxWidth={{ base: "default", md: "70%" }}
    >
      <Box>
        <Text mt="67px" textStyle="mobileHeader1">
          My Account
        </Text>
        <FormControl mt="2rem" isReadOnly>
          <Text mb="1em" textStyle="mobileBodyBold" color="hubbard.100">
            Organization
          </Text>
          <Box>
            <Text>Name of business</Text>
            <Input
              mt="2"
              value={businessName}
              name="businessName"
              placeholder="Enter name of business"
              variant="unstyled"
              size="sm"
              color="hubbard.100"
              fontWeight="500"
            />
          </Box>
          <Text
            mt={{ base: "40px", md: "54px" }}
            mb="1em"
            textStyle="mobileBodyBold"
            color="hubbard.100"
          >
            Point of Contact
          </Text>
          <HStack spacing={{ base: "default", md: "80px" }}>
            <Box>
              <Text>First name</Text>
              <Input
                mt="2"
                value={authenticatedUser!.firstName}
                name="firstName"
                placeholder="Enter first name"
                variant="unstyled"
                size="sm"
                color="hubbard.100"
                fontWeight="500"
              />
            </Box>
            <Box mt="2rem">
              <Text>Last name</Text>
              <Input
                mt="2"
                value={authenticatedUser!.lastName}
                name="lastName"
                placeholder="Enter last name"
                variant="unstyled"
                size="sm"
                color="hubbard.100"
                fontWeight="500"
              />
            </Box>
          </HStack>
          <Box mt={{ base: "24px", md: "40px" }}>
            <Text>Phone number</Text>
            <Input
              mt="2"
              type="tel"
              value={authenticatedUser!.phoneNumber}
              name="phoneNumber"
              placeholder="Enter phone number"
              variant="unstyled"
              size="sm"
              color="hubbard.100"
              fontWeight="500"
            />
          </Box>
          <Box mt={{ base: "24px", md: "40px" }}>
            <Text>Email address</Text>
            <Input
              mt="2"
              value={authenticatedUser!.email}
              name="email"
              placeholder="Enter email"
              variant="unstyled"
              size="sm"
              color="hubbard.100"
              fontWeight="500"
            />
          </Box>
          <Box mt={{ base: "66px", md: "56px" }}>
            <Button
              width="100%"
              size="lg"
              mt="2"
              variant="navigation"
              onClick={navigateToDashboard}
            >
              View Scheduled Donations
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Container>
  );
};

export default Account;
