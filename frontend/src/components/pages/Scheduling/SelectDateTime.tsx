import { Button, Container, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import { Redirect } from "react-router-dom";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
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
  const { authenticatedUser } = useContext(AuthContext);

  enum DayParts {
    EARLY_MORNING = "Early Morning (12am - 6am)",
    MORNING = "Morning (6am - 11am)",
    AFTERNOON = "Afternoon (11pm - 4pm)",
    EVENING = "Evening (4pm - 9pm)",
    NIGHT = "Night (9pm - 12am)",
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
    night: ["9:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM"],
  };

  const frequencies = ["One time donation", "Daily", "Weekly", "Monthly"];

  const getTimeSlot = (selectedDayPart: string) => {
    switch (selectedDayPart) {
      case DayParts.EARLY_MORNING:
        return timeRanges.earlyMorning;
      case DayParts.MORNING:
        return timeRanges.morning;
      case DayParts.AFTERNOON:
        return timeRanges.afternoon;
      case DayParts.EVENING:
        return timeRanges.evening;
      case DayParts.NIGHT:
        return timeRanges.night;
      default:
        return null;
    }
  };

  const [timeRange, setTimeRange] = useState(`${startTime} - ${endTime}`);
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(
    getTimeSlot(dayPart),
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // TODO: Need to edit this to update + calculate based on schedules pulled from backend
  const [icons, setIcons] = useState<number[]>([0, 0, 1, 0, 3]);

  React.useEffect(() => {
    const fetchSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };
    fetchSchedules();
  }, [authenticatedUser]);

  if (!authenticatedUser) {
    return <Redirect to={Routes.HOME_PAGE} />;
  }

  const showDropOffTimes = (selectedDayPart: string) => {
    const timeSlot = getTimeSlot(selectedDayPart);
    setShowTimeSlots(timeSlot);
    console.log(schedules[0]?.endTime.toString());

    // const d = new Date()
    // console.log(d)
    // schedules.forEach(schedule => {
    //   const start = new Date(schedule?.startTime.toDa);
    //   const end = schedule?.endTime;

    // })
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    if (name === "dayPart") {
      showDropOffTimes(e.toString());
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
    <Container p="30px">
        <SchedulingProgressBar activeStep={0} totalSteps={4} />
        <Text textStyle="mobileHeader2" mt="2em">Date and Time</Text>
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
          icons={[]}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "dayPart");
          }}
        />
        {showTimeSlots && (
          <RadioSelectGroup
            name="timeRanges"
            label="Select drop off time"
            helperText="From the options below, select your first choice."
            helperText2="Each [] represents an already signed up donor. Please try to choose a time slot without a pre-existing donor. "
            value={timeRange}
            values={showTimeSlots}
            icons={icons}
            isRequired
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleTimeRangeChange(e);
            }}
          />
        )}
        <RadioSelectGroup
          name="frequency"
          label="Select frequency"
          helperText="How often will this donation occur?"
          value={frequency}
          values={frequencies}
          icons={[]}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "frequency");
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
