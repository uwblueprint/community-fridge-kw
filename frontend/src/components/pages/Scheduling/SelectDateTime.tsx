import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";

import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const SelectDateTime = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  //   const { insert form fields for this page here } = formData;

  return (
    // Insert Select Date and Time page here
    <Container>
      <SchedulingProgressBar activeStep={0} totalSteps={4} />
      <Text textStyle="mobileHeader2"> This is Date and Time page </Text>
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

export default SelectDateTime;
