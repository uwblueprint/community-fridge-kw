import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
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
  const {
    dayPart,
    frequency,
    startTime,
    endTime,
    recurringDonationEndDate,
  } = formValues;
  const { authenticatedUser } = useContext(AuthContext);

  enum DayParts {
    EARLY_MORNING = "Early Morning (12am - 6am)",
    MORNING = "Morning (6am - 11am)",
    AFTERNOON = "Afternoon (11am - 4pm)",
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

  const get12HTimeString = (type: "start" | "end") => {
    const time = type === "start" ? startTime : endTime;
    const time24Hour = `${new Date(time).getHours().toString()}:00`;
    return moment(time24Hour, "HH:mm").format("h:mm A");
  };

  const [date, setDate] = useState<Date>(new Date(startTime));
  const [timeRange, setTimeRange] = useState(
    `${get12HTimeString("start")} - ${get12HTimeString("end")}`,
  );
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(
    getTimeSlot(dayPart),
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // TODO: Need to edit this to update + calculate based on schedules pulled from backend
  const [icons, setIcons] = useState<number[]>([0, 0, 1, 0, 3]);
  const [isOneTimeDonation, setIsOneTimeDonation] = useState<boolean>(true);

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

    // render person icons using setIcons
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    if (name === "dayPart") {
      showDropOffTimes(e.toString());
    } else if (name === "frequency") {
      const val = e.toString();
      if (val === "One time donation") {
        setIsOneTimeDonation(true);
      } else {
        setIsOneTimeDonation(false);
      }
    }
  };

  // splits timeRange into startTime and endTime in formValues
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeRange(e.toString());
    const timeRangeSelected = e.toString();
    const tokens = timeRangeSelected.split(" - ");
    // converrt start and end time to 24h values
    const convertedStartTime = moment(tokens[0], "hh:mm A").format("HH:mm");
    const convertedEndTime = moment(tokens[1], "hh:mm A").format("HH:mm");

    const newStartTime = new Date(`11/11/1970 ${convertedStartTime}`);
    const newEndTime = new Date(`11/11/1970 ${convertedEndTime}`);
    newStartTime.setDate(date.getDate());
    newStartTime.setMonth(date.getMonth());
    newStartTime.setFullYear(date.getFullYear());

    newEndTime.setDate(date.getDate());
    newEndTime.setMonth(date.getMonth());
    newEndTime.setFullYear(date.getFullYear());

    setForm({ target: { name: "startTime", value: newStartTime.toString() } });
    setForm({ target: { name: "endTime", value: newEndTime.toString() } });
  };

  const handleDateSelect = (selectedDate: DateObject) => {
    const selectedDateObj = selectedDate.toDate();

    setDate(selectedDateObj);
    selectedDateObj.setHours(new Date(startTime).getHours());
    setForm({
      target: { name: "startTime", value: selectedDateObj.toString() },
    });
    selectedDateObj.setHours(new Date(endTime).getHours());
    setForm({ target: { name: "endTime", value: selectedDateObj.toString() } });
  };

  return (
    <Container p="30px">
      <SchedulingProgressBar activeStep={0} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em" mb="1em">
        Date and Time
      </Text>
      <FormControl isRequired>
        <FormLabel fontWeight="600">Select date of donation</FormLabel>
        <Calendar
          buttons={false}
          disableMonthPicker
          disableYearPicker
          shadow={false}
          minDate={new Date()}
          value={date}
          onChange={handleDateSelect}
        />
      </FormControl>
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
      {!isOneTimeDonation && (
        <FormControl isRequired mb="3em">
          <FormLabel fontWeight="600">Proposed end date</FormLabel>
          <Input
            value={recurringDonationEndDate}
            onChange={(e) =>
              handleChange(e.target.value, "recurringDonationEndDate")
            }
            placeholder="MM/DD/YYYY"
          />
        </FormControl>
      )}
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
