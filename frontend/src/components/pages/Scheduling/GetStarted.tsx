import { Button, Container, Img, Text } from "@chakra-ui/react";
import React from "react";

import cfImage from "../../../assets/scheduling_getstarted.svg";
import { SchedulingStepProps } from "./types";

const GetStarted = ({ navigation }: SchedulingStepProps) => {
  const { next } = navigation;

  return (
    <Container pl="42px" pr="42px" pt="73px">
      <Text marginBottom="30px" textStyle="mobileHeader2">
        Schedule new donation drop off
      </Text>
      <Text marginBottom="30px" textStyle="mobileBody">
        Submit general information of the food you are planning to donate. Pick
        the date and time you’re available to come in.
      </Text>
      <Text marginBottom="30px" textStyle="mobileBody">
        Availabilities are based upon ensuring consistant food stock in the
        fridge for as long as possible. Contact admin for specific time
        requests.
      </Text>
      <Img src={cfImage} alt="Community Fridge" marginBottom="50px" />
      <Button onClick={next} variant="navigation">
        Get started
      </Button>
    </Container>
  );
};

export default GetStarted;
