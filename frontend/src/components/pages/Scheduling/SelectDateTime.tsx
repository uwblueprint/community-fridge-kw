import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";

import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const SelectDateTime = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { dayPart } = formValues;

  const dayParts = [
    "Early Morning (12am - 6am)",
    "Morning (6am - 11am)",
    "Afternoon (11pm - 4pm)",
    "Evening (4pm - 9pm)",
    "Night (9pm - 12am)",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
  };
  return (
    <Container>
      <SchedulingProgressBar activeStep={0} totalSteps={4} />
      <Text textStyle="mobileHeader2"> This is Date and Time page </Text>
      <RadioSelectGroup
        name="dayPart"
        label="What time of day would you like to drop off your donation?"
        value={dayPart}
        values={dayParts}
        isRequired
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e, "dayPart");
        }}
      />
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
