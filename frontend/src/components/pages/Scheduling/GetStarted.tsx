import { Button, Container, Img, Text } from "@chakra-ui/react";
import React from "react";

import cfImage from "../../../assets/scheduling_getstarted.png";
import { SchedulingStepProps } from "./types";

const GetStarted = ({ navigation }: SchedulingStepProps) => {
  const { next } = navigation;

  return (
    <Container variant="responsiveContainer">
      <Text marginBottom="30px" textStyle="mobileHeader2">
        Schedule a donation drop off
      </Text>
      <Text marginBottom="1rem" textStyle="mobileBody">
        Submit general information of the food you are planning to donate. Pick
        the date and time you’re available to come in.
      </Text>
      <Text marginBottom="30px" textStyle="mobileBody">
        Availabilities are based upon ensuring consistant food stock in the
        fridge for as long as possible. Contact admin for specific time
        requests.
      </Text>
      <Img
        src={cfImage}
        alt="Community Fridge"
        marginBottom="50px"
        width="100%"
        maxWidth="600px"
      />
      <Button onClick={next} variant="navigation" w="100%" maxWidth="500px">
        Get started
      </Button>
    </Container>
  );
};

export default GetStarted;
