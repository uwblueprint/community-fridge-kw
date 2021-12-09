import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/purple.css";

import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useState } from "react";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { Redirect } from "react-router-dom";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ErrorMessages from "./ErrorMessages";
import { SchedulingStepProps } from "./types";

const SelectDateTime = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next, go } = navigation;
  const {
    id,
    dayPart,
    frequency,
    startTime,
    endTime,
    recurringDonationEndDate,
  } = formValues;

  const [formErrors, setFormErrors] = useState({
    date: "",
    dayPart: "",
    timeRange: "",
    frequency: "",
    recurringDonationEndDate: "",
  });

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
      "12:00 AM - 1:00 AM",
      "1:00 AM - 2:00 AM",
      "2:00 AM - 3:00 AM",
      "3:00 AM - 4:00 AM",
      "4:00 AM - 5:00 AM",
      "5:00 AM - 6:00 AM",
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
      setFormErrors({
        ...formErrors,
        dayPart: "",
      });
    } else if (name === "frequency") {
      const val = e.toString();
      if (val === "One time donation") {
        setIsOneTimeDonation(true);
      } else {
        setIsOneTimeDonation(false);
      }
      setFormErrors({
        ...formErrors,
        frequency: "",
      });
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

    setFormErrors({
      ...formErrors,
      timeRange: "",
    });
  };

  const handleDateSelect = (selectedDate: DateObject) => {
    const selectedDateObj = selectedDate.toDate();

    setDate(selectedDateObj);
    if (startTime !== "")
      selectedDateObj.setHours(new Date(startTime).getHours());
    setForm({
      target: { name: "startTime", value: selectedDateObj.toString() },
    });
    if (endTime !== "") selectedDateObj.setHours(new Date(endTime).getHours());
    setForm({ target: { name: "endTime", value: selectedDateObj.toString() } });
    setShowTimeSlots(getTimeSlot("")); // reset timeslots
    setForm({ target: { name: "dayPart", value: "" } }); // reset daypart
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
    setFormErrors({
      ...formErrors,
      recurringDonationEndDate: "",
    });
  };

  const onSaveClick = async () => {
    await SchedulingAPIClient.updateSchedule(id, formValues);
    if (go !== undefined) {
      go("confirm donation details");
    }
  };

  const validateForm = () => {
    const newErrors = {
      date: "",
      dayPart: "",
      timeRange: "",
      frequency: "",
      recurringDonationEndDate: "",
    };
    let valid = true;

    if (!date) {
      valid = false;
      newErrors.date = ErrorMessages.requiredField;
    }
    if (!dayPart) {
      valid = false;
      newErrors.dayPart = ErrorMessages.requiredField;
    }
    if (!endTime) {
      // Null endTime means a timeRange was not selected in the form
      valid = false;
      newErrors.timeRange = ErrorMessages.requiredField;
    }
    if (!frequency) {
      valid = false;
      newErrors.frequency = ErrorMessages.requiredField;
    } else if (frequency !== "One time donation") {
      if (!recurringDonationEndDate) {
        valid = false;
        newErrors.recurringDonationEndDate = ErrorMessages.requiredField;
      } else if (recurringDonationEndDate === "Invalid Date") {
        valid = false;
        newErrors.recurringDonationEndDate =
          ErrorMessages.invalidRecurringDonationEndDateFormat;
      } else {
        // Validate end date is within 6 months of start date
        const startDate = new Date(startTime);
        const maxEndDate = new Date(startTime);
        maxEndDate.setMonth(startDate.getMonth() + 6);
        const endDate = new Date(recurringDonationEndDate);
        if (!(startDate <= endDate && endDate <= maxEndDate)) {
          valid = false;
          newErrors.recurringDonationEndDate =
            ErrorMessages.recurringDonationEndDateWithinSixMonths;
        }
      }
    }
    setFormErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  const today = new Date();
  const getSunday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const getMaxDate = () => {
    const sunday = getSunday(today);
    const diff = sunday.getDate() + 13;
    return new Date(sunday.setDate(diff));
  };

  return (
    <Container p="30px">
      <SchedulingProgressBar activeStep={0} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em" mb="1em">
        Date and Time
      </Text>
      <FormControl isRequired isInvalid={!!formErrors.date}>
        <FormLabel fontWeight="600">Select date of donation</FormLabel>
        <DatePicker
          render={<InputIcon style={{ height: "3em" }} />}
          className="rmdp-mobile purple"
          minDate={getSunday(today)}
          maxDate={getMaxDate()}
          value={date}
          onChange={handleDateSelect}
        />
        <FormErrorMessage>{formErrors.date}</FormErrorMessage>
      </FormControl>
      <RadioSelectGroup
        name="dayPart"
        label="What time of day would you like to drop off your donation?"
        value={dayPart}
        values={dayParts}
        icons={[]}
        isRequired
        error={formErrors.dayPart}
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
          error={formErrors.timeRange}
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
        error={formErrors.frequency}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e, "frequency");
        }}
      />
      {!isOneTimeDonation && (
        <FormControl
          isRequired
          isInvalid={!!formErrors.recurringDonationEndDate}
          mb="3em"
        >
          <FormLabel fontWeight="600">Proposed end date</FormLabel>
          <Input
            isDisabled={isBeingEdited}
            value={recurringEndDate}
            onChange={(e) => handleChangeRecurringDate(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <FormErrorMessage>
            {formErrors.recurringDonationEndDate}
          </FormErrorMessage>
        </FormControl>
      )}
      {isBeingEdited ? (
        <VStack>
          <Button onClick={onSaveClick} variant="navigation" w="100%">
            Save Changes
          </Button>
          <Button
            onClick={() => go && go("confirm donation details")}
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
          <Button onClick={handleNext} variant="navigation">
            Next
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default SelectDateTime;
