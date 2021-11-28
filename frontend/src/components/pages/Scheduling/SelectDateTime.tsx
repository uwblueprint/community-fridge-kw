import { Button, Container, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Calendar } from "react-multi-date-picker";

import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const SelectDateTime = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { daypart, frequency, startTime, endTime } = formValues;

  const [timeRange, setTimeRange] = useState(`${startTime} - ${endTime}`);

  const dayparts = [
    "Early Morning (12am - 6am)",
    "Morning (6am - 11am)",
    "Afternoon (11pm - 4pm)",
    "Evening (4pm - 9pm)",
    "Night (9pm - 12am)",
  ];

  const frequencies = ["One time donation", "Daily", "Weekly", "Monthly"];

  const timeRanges = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 AM",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
  };

  // splits timeRange into startTime and endTime in formValues
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeRange(e.toString());
    const timeRangeSelected = e.toString();
    const tokens = timeRangeSelected.split(" - ");
    setForm({ target: { name: "startTime", value: tokens[0] } });
    setForm({ target: { name: "endTime", value: tokens[1] } });
  };

  return (
    <Container>
      <VStack spacing="45px">
        <SchedulingProgressBar activeStep={0} totalSteps={4} />
        <Text textStyle="mobileHeader2">Date and Time</Text>
        <Calendar
          buttons={false}
          disableMonthPicker
          disableYearPicker
          shadow={false}
          minDate={new Date()}
        />
        <RadioSelectGroup
          name="daypart"
          label="What time of day would you like to drop off your donation?"
          value={daypart}
          values={dayparts}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "daypart");
          }}
        />
        <RadioSelectGroup
          name="timeRanges"
          label="Select drop off time"
          helperText="From the options below, select your first choice."
          helperText2="Each [] represents an already signed up donor. Please try to choose a time slot without a pre-existing donor. "
          value={timeRange}
          values={timeRanges}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleTimeRangeChange(e);
          }}
        />
        <RadioSelectGroup
          name="frequency"
          label="Select frequency"
          helperText="How often will this donation occur?"
          value={frequency}
          values={frequencies}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "frequency");
          }}
        />
      </VStack>
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
