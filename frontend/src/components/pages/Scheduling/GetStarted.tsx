import { Button, Container, Img, Text } from "@chakra-ui/react";
import React from "react";

import cfImage from "../../../assets/scheduling_getstarted.png";
import { SchedulingStepProps } from "./types";

const GetStarted = ({ navigation }: SchedulingStepProps) => {
  const { next } = navigation;

  return (
    <Container variant="responsiveContainer">
      <Text marginBottom="30px" textStyle="mobileHeader2">
        Schedule a donation drop-off
      </Text>
      <Text marginBottom="1rem" textStyle="mobileBody" color="hubbard.100">
        Submit information for your upcoming planned donation(s) to the
        community fridge. Pick the date and time window in which you hope to
        make your donation.
      </Text>
      <Text marginBottom="30px" textStyle="mobileBody" color="hubbard.100">
        Our goal is to maintain a consistent stock of donated food in the fridge
        & pantry, at any given time, on any given day. The scheduling tool
        enables us to space out donations - effectively maximizing your impact
        on community
      </Text>
      <Img
        src={cfImage}
        alt="Community Fridge"
        marginBottom="50px"
        width="100%"
        maxWidth="600px"
      />
      <Button
        onClick={next}
        variant="navigation"
        w="100%"
        maxWidth="500px"
        size="lg"
      >
        Get started
      </Button>
    </Container>
  );
};

export default GetStarted;
