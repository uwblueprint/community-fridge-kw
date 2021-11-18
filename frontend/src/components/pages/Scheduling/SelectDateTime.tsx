import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";

import RadioSelectGroup from "../../common/RadioSelectGroup";
import { SchedulingStepProps } from "./types";

const SelectDateTime = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { daypart } = formValues;

  const dayparts = [
    "Early Morning (12am - 6am)",
    "Morning (6am - 11am)",
    "Afternoon (11pm - 4pm)",
    "Evening (4pm - 9pm)",
    "Night (9pm - 12am)",
  ];

  const handleChange = (e: any, name: string) => {
    setForm({ target: { name, value: e } });
  };

  return (
    <Container>
      <Text textStyle="mobileHeader2"> This is Date and Time page </Text>
      <RadioSelectGroup
        name="daypart"
        label="What time of day would you like to drop off your donation?"
        value={daypart}
        values={dayparts}
        isRequired
        onChange={(e: any) => handleChange(e, "daypart")}
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
