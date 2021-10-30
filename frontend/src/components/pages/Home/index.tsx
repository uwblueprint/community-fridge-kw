import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";

import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = () => {
  return (
    <>
      <Container
        centerContent
        paddingLeft="42px"
        paddingRight="42px"
        paddingTop="73px"
      >
        <Text marginBottom="13px" textStyle="heading">
          Welcome to Community Fridge KW
        </Text>
        <Text marginBottom="30px" textStyle="body">
          Community fridges are public repositories of fresh, donated foods that
          anyone can take from for free.
        </Text>
        <Stack ml="-42px" spacing="1rem">
          <Button backgroundColor="black.100" color="white.100" size="lg">
            Schedule a food dropoff
          </Button>
          <Button backgroundColor="white.100" size="lg" variant="outline">
            Sign up to volunteer
          </Button>
        </Stack>
        <Box mt="84px" w="100%" h="10rem" backgroundColor="gray.100" />
        <DonationProcess />
      </Container>
      <VolunteerRoles />
    </>
  );
};

export default Home;
