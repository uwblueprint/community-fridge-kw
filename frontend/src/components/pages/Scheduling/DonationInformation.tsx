import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";

import { SchedulingStepProps } from "./types";

const DonationInformation = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { daypart } = formValues;

  return (
    // Insert Select Date and Time page here
    <Container>
      <Text textStyle="mobileHeader2">This is Donation Information Page </Text>
      <HStack>
        <Button onClick={previous} variant="navigation">
          Back
        </Button>
        <Button onClick={next} variant="navigation">
          Next
        </Button>
      </HStack>
    </Container>
  );
};

export default DonationInformation;
