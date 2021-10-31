import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import DonationProcess from "./DonationProcess";
import Header from "./Header";
import VolunteerRoles from "./VolunteerRoles";

const Home = () => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Container centerContent pl="42px" pr="42px" pt="73px">
        <Text marginBottom="13px" textStyle="heading">
          Welcome to Community Fridge KW
        </Text>
        <Text marginBottom="30px" textStyle="body">
          Community fridges are public repositories of fresh, donated foods that
          anyone can take from for free.
        </Text>
        <Stack ml="-42px" spacing="1rem">
          <Button
            onClick={() => history.push("/login")}
            backgroundColor="black.100"
            color="white.100"
            size="lg"
          >
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
