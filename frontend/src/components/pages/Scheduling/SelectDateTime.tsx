import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { Redirect, useHistory } from "react-router-dom";

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
  const history = useHistory();
  const {
    id,
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

  const get12HTimeString = (time: string) => {
    const time24Hour = `${new Date(time).getHours().toString()}:00`;
    return moment(time24Hour, "HH:mm").format("h:mm A");
  };

  // setting state initial values
  const [date, setDate] = useState<Date>(new Date(startTime));
  const [timeRange, setTimeRange] = useState(
    `${get12HTimeString(startTime)} - ${get12HTimeString(endTime)}`,
  );
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(
    getTimeSlot(dayPart),
  );
  const [icons, setIcons] = useState<number[]>([0, 0, 0, 0, 0]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isOneTimeDonation, setIsOneTimeDonation] = useState<boolean>(
    frequency === "One time donation" || frequency === "",
  );
  const [recurringEndDate, setRecurringEndDate] = useState<string>(
    recurringDonationEndDate
      ? moment(recurringDonationEndDate).format("MM/DD/YYYY")
      : "",
  );

  // fetch schedules
  React.useEffect(() => {
    const fetchSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };
    fetchSchedules();
  }, [authenticatedUser]);

  if (!authenticatedUser) {
    return <Redirect to={Routes.LANDING_PAGE} />;
  }

  const getIconsPerTimeSlot = (selectedDayPart: string, selectedDate: Date) => {
    const iconsPerTimeSlot = [0, 0, 0, 0, 0] as number[];
    schedules.forEach((schedule) => {
      if (schedule) {
        if (new Date(schedule.startTime).getDate() === selectedDate.getDate()) {
          if (schedule.dayPart === selectedDayPart) {
            const timeSlots = getTimeSlot(schedule.dayPart);
            if (timeSlots) {
              timeSlots.forEach((timeSlot, i) => {
                const start = timeSlot.split(" - ")[0];
                if (get12HTimeString(schedule.startTime) === start) {
                  iconsPerTimeSlot[i] += 1;
                }
              });
            }
          }
        }
      }
    });
    return iconsPerTimeSlot;
  };

  const showDropOffTimes = (selectedDayPart: string, selectedDate: Date) => {
    const timeSlot = getTimeSlot(selectedDayPart);
    setShowTimeSlots(timeSlot);
    setIcons(getIconsPerTimeSlot(selectedDayPart, selectedDate));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    if (name === "dayPart") {
      showDropOffTimes(e.toString(), date);
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

    // convert start and end time to 24h values
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
    if (dayPart) showDropOffTimes(dayPart, date);
  };

  const handleChangeRecurringDate = (
    e: React.ChangeEvent<HTMLInputElement> | string,
  ) => {
    setRecurringEndDate(e.toString());
    const recurringDate = new Date(e.toString());
    setForm({
      target: {
        name: "recurringDonationEndDate",
        value: recurringDate.toString(),
      },
    });
  };

  const onSaveClick = async () => {
    await SchedulingAPIClient.updateSchedule(id, formValues);
    history.push(Routes.DASHBOARD_PAGE);
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
          value={timeRange}
          values={showTimeSlots}
          icons={icons}
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleTimeRangeChange(e);
          }}
        />
      )}

      {isBeingEdited && (
        <Text textStyle="mobileBody" mt="2em">
          The following fields cannot be edited. If you would like to edit these
          please contact Community Fridge admin.
        </Text>
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
            isDisabled={isBeingEdited}
            value={recurringEndDate}
            onChange={(e) => handleChangeRecurringDate(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </FormControl>
      )}
      {isBeingEdited ? (
        <VStack>
          <Button onClick={onSaveClick} variant="navigation" w="100%">
            Save Changes
          </Button>
          <Button
            onClick={() => history.push(Routes.DASHBOARD_PAGE)}
            variant="cancelNavigation"
            w="100%"
          >
            Cancel
          </Button>
        </VStack>
      ) : (
        <HStack>
          <Button onClick={previous} variant="navigation">
            Back
          </Button>
          <Button onClick={next} variant="navigation">
            Next
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default SelectDateTime;
