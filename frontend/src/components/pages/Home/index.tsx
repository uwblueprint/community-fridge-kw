import { Button, Container, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { SCHEDULING_PAGE } from "../../../constants/Routes";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = (): JSX.Element => {
  const history = useHistory();

  return (
    <>
      <Container centerContent pl="42px" pr="42px" pt="73px">
        <Image
          src="drawer-logo.png"
          alt="Community Fridge logo"
          borderRadius="100px"
          marginRight="50%"
          maxWidth="145px"
          maxHeight="145px"
        />
        <Text align="left" marginBottom="13px" textStyle="mobileHeader1">
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
        <DonationProcess />
      </Container>
      <VolunteerRoles />
    </>
  );
};

export default Home;
