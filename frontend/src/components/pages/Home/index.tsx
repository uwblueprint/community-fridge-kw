import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { SCHEDULING_PAGE } from "../../../constants/Routes";
import Header from "../../common/Header";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = (): JSX.Element => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Container centerContent pl="42px" pr="42px" pt="73px">
        <Text marginBottom="13px" textStyle="mobileHeader1">
          Welcome to Community Fridge KW
        </Text>
        <Text marginBottom="30px" textStyle="mobileBody">
          Community fridges are public repositories of fresh, donated foods that
          anyone can take from for free.
        </Text>
        <Button
          size="lg"
          onClick={() => history.push(SCHEDULING_PAGE)}
          variant="navigation"
        >
          Schedule a food dropoff
        </Button>
        <Box mt="84px" w="100%" h="10rem" backgroundColor="gray.100" />
        <DonationProcess />
      </Container>
      <VolunteerRoles />
    </>
  );
};

export default Home;
