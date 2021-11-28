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
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { dayPart, frequency, startTime, endTime } = formValues;

  const [timeRange, setTimeRange] = useState(`${startTime} - ${endTime}`);
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(null);

  enum DayParts {
    EARLY_MORNING = "Early Morning (12am - 6am)",
    MORNING = "Morning (6am - 11am)",
    AFTERNOON = "Afternoon (11pm - 4pm)",
    EVENING = "Evening (4pm - 9pm)",
    NIGHT = "Night (9pm - 12am)"
  }

  const dayParts = [
    DayParts.EARLY_MORNING,
    DayParts.MORNING,
    DayParts.AFTERNOON,
    DayParts.EVENING,
    DayParts.NIGHT,
  ];

  const timeRanges = {
    earlyMorning: [
      "12:00 AM - 1:00AM",
      "1:00 AM - 2:00AM",
      "2:00 AM - 3:00AM",
      "3:00 AM - 4:00AM",
      "4:00 AM - 5:00AM",
      "5:00 AM - 6:00AM",
    ],
    morning: [
      "6:00 AM - 7:00 AM",
      "7:00 AM - 8:00 AM",
      "8:00 AM - 9:00 AM",
      "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
    ],
    afternoon: [
      "11:00 AM - 12:00 PM",
      "12:00 PM - 1:00 PM",
      "1:00 PM - 2:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
    ],
    evening: [
      "4:00 PM - 5:00 PM",
      "5:00 PM - 6:00 PM",
      "6:00 PM - 7:00 PM",
      "7:00 PM - 8:00 PM",
      "8:00 PM - 9:00 PM",
    ],
    night: [
      "9:00 PM - 10:00 PM",
      "10:00 PM - 11:00 PM",
      "11:00 PM - 12:00 AM",
    ]
  };

  const frequencies = ["One time donation", "Daily", "Weekly", "Monthly"];

  const showDropOffTimes = (selectedDayPart: string) => {
    switch(selectedDayPart) {
      case DayParts.EARLY_MORNING:
        setShowTimeSlots(timeRanges.earlyMorning);
        break;
      case DayParts.MORNING:
        setShowTimeSlots(timeRanges.morning);
        break;
      case DayParts.AFTERNOON:
        setShowTimeSlots(timeRanges.afternoon);
        break;
      case DayParts.EVENING:
        setShowTimeSlots(timeRanges.evening);
        break;
      case DayParts.NIGHT:
        setShowTimeSlots(timeRanges.night);
        break;
      default:
        setShowTimeSlots(null);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    if(name === "dayPart"){
      showDropOffTimes(e.toString())
    }
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
          name="dayPart"
          label="What time of day would you like to drop off your donation?"
          value={dayPart}
          values={dayParts}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "dayPart");
          }}
        />
        {showTimeSlots && <RadioSelectGroup
          name="timeRanges"
          label="Select drop off time"
          helperText="From the options below, select your first choice."
          helperText2="Each [] represents an already signed up donor. Please try to choose a time slot without a pre-existing donor. "
          value={timeRange}
          values={showTimeSlots}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleTimeRangeChange(e);
          }}
        />}
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
