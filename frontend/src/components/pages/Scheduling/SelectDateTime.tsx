import "react-multi-date-picker/styles/layouts/mobile.css";
import "./selectDateTime.css";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useContext, useState } from "react";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";
import { format } from "date-fns";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import useViewport from "../../../hooks/useViewport";
import { Schedule } from "../../../types/SchedulingTypes";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ErrorMessages from "./ErrorMessages";
import {
  dayParts,
  DayPartsEnum,
  frequencies,
  SchedulingStepProps,
  timeRanges,
} from "./types";
import BackButton from "./BackButton";
import NextButton from "./NextButton";

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

  const { isDesktop } = useViewport();

  const getTimeSlot = (selectedDayPart: string) => {
    switch (selectedDayPart) {
      case DayPartsEnum.EARLY_MORNING:
        return timeRanges.earlyMorning;
      case DayPartsEnum.MORNING:
        return timeRanges.morning;
      case DayPartsEnum.AFTERNOON:
        return timeRanges.afternoon;
      case DayPartsEnum.EVENING:
        return timeRanges.evening;
      case DayPartsEnum.NIGHT:
        return timeRanges.night;
      default:
        return null;
    }
  };

  const get12HTimeString = (time: string) => {
    const time24Hour = `${new Date(time).getHours().toString()}:00`;
    return moment(time24Hour, "HH:mm").format("h:mm A");
  };

  const getSubmitState = () => {
    const filled = !!dayPart && !!startTime && !!endTime && !!frequency;
    return frequency === frequencies[0] ? filled : filled && !!recurringDonationEndDate;
  }

  // setting state initial values
  const [date, setDate] = useState<Date>(new Date(startTime));
  const [timeRange, setTimeRange] = useState(
    `${get12HTimeString(startTime)} - ${get12HTimeString(endTime)}`,
  );
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(
    getTimeSlot(dayPart),
  );
  const [frequencyLabels, setFrequencyLabels] = useState<string[]>(frequencies);
  const [showTimeofDay, setShowTimeofDay] = useState<boolean>(
    false
  );

  const [icons, setIcons] = useState<number[]>([0, 0, 0, 0, 0]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [recurringEndDate, setRecurringEndDate] = useState<Date>(new Date(startTime));

  React.useEffect(() => {
    // fetch schedules
    const fetchSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };
    fetchSchedules();
  }, [authenticatedUser]);

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
      setForm({ target: { name: "startTime", value: "" } });
      setForm({ target: { name: "endTime", value: "" } });
      setFormErrors({
        ...formErrors,
        dayPart: "",
      });
    } else if (name === "frequency") {
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

  console.log(formValues);
  const handleDateSelect = (selectedDate: DateObject) => {
    const selectedDateObj = selectedDate.toDate();
    setDate(selectedDateObj);
    setShowTimeofDay(true);
    setShowTimeSlots(getTimeSlot("")); // reset timeslots
    setForm({ target: { name: "dayPart", value: "" } }); // reset daypart
    setFormErrors({
      ...formErrors,
      date: "",
    });

    // update frequency labels
    const newFrequencyLabels = [...frequencies];
    newFrequencyLabels.forEach((freq, i) => {
      if (freq === frequencies[2]) {
        newFrequencyLabels[i] = `Weekly on ${format(new Date(selectedDateObj), "EEEE")}s`;
      } else if (freq === frequencies[3]) {
        newFrequencyLabels[i] = `Monthly on the ${format(new Date(selectedDateObj), "do")}`;
      }
    });
    setFrequencyLabels(newFrequencyLabels);
  };

  const handleChangeRecurringDate = (selectedDate: DateObject) => {
    const selectedDateObj = selectedDate.toDate();
    setRecurringEndDate(selectedDateObj);

    const recurringDate = new Date(selectedDateObj);
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

  const validateForm = () => {
    const newErrors = {
      date: "",
      dayPart: "",
      timeRange: "",
      frequency: "",
      recurringDonationEndDate: "",
    };
    let valid = true;

    if (!date || date.toString() === "Invalid Date") {
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
    } else if (frequency !== frequencies[0]) {
      if (!recurringDonationEndDate) {
        valid = false;
        newErrors.recurringDonationEndDate = ErrorMessages.requiredField;
      } else if (recurringDonationEndDate === "Invalid Date") {
        valid = false;
        newErrors.recurringDonationEndDate =
          ErrorMessages.invalidRecurringDonationEndDateFormat;
      } else {
        // Validate end date is within 6 months of start date
        const startDateVal = new Date(startTime);
        const maxRecurringEndDateVal = new Date(startTime);
        maxRecurringEndDateVal.setMonth(startDateVal.getMonth() + 6);
        const recurringEndDateVal = new Date(recurringDonationEndDate);
        // Setting time to 11:59 so editing the last
        // recurring donation doesn't throw an error
        recurringEndDateVal.setHours(23);
        recurringEndDateVal.setMinutes(59);

        if (startDateVal > recurringEndDateVal) {
          valid = false;
          newErrors.recurringDonationEndDate =
            ErrorMessages.recurringEndDateAfterStartDate;
        } else if (recurringEndDateVal > maxRecurringEndDateVal) {
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

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }
    await SchedulingAPIClient.updateSchedule(id, formValues);
    if (go !== undefined) {
      go("confirm donation details");
    }
  };

  const today = new Date();
  const getMaxDate = () => {
    const diff = today.getDate() + 13;
    return new Date(today.setDate(diff));
  };

  return (
    <Container variant="responsiveContainer">
      <BackButton 
        isBeingEdited={isBeingEdited}
        onSaveClick={onSaveClick}
        previous={previous}
      />
      <SchedulingProgressBar activeStep={0} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em" mb="1em">
        {isDesktop ? "Drop-off date and time" : "Date and Time"}
      </Text>
      <FormControl isRequired isInvalid={!!formErrors.date}>
        <FormLabel fontWeight="600">Select date</FormLabel>
        <Calendar
          className={isDesktop ? "rmdp-mobile desktop" : "rmdp-mobile" }
          minDate={new Date().setDate(today.getDate())}
          maxDate={getMaxDate()}
          value={date}
          onChange={handleDateSelect}
        />
        <FormErrorMessage>{formErrors.date}</FormErrorMessage>
      </FormControl>
      {(showTimeofDay || dayPart) && (
        <RadioSelectGroup
          name="dayPart"
          label="Select time of day"
          value={dayPart}
          values={dayParts}
          icons={[]}
          isRequired
          error={formErrors.dayPart}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "dayPart");
          }}
        />
      )}
      {(!!dayPart && showTimeSlots) && (
        <RadioSelectGroup
          name="timeRanges"
          label="Select drop-off time"
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
      {(!!startTime && !!dayPart) && (
        <FormControl
          isRequired
          isDisabled={isBeingEdited}
          isInvalid={!!formErrors.frequency}
          mb="2em"
        >
          <RadioSelectGroup
            name="frequency"
            label="Select frequency"
            helperText="How often will this donation occur?"
            value={frequency}
            values={frequencyLabels}
            icons={[]}
            isRequired
            isDisabled={isBeingEdited}
            error={formErrors.frequency}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(e, "frequency");
            }}
          />
          <FormErrorMessage>{formErrors.frequency}</FormErrorMessage>
        </FormControl>
      )}
      {((!!frequency && frequency !== frequencies[0]) && !!startTime && !!dayPart) && (
        <FormControl
          isRequired
          isInvalid={!!formErrors.recurringDonationEndDate}
          mb="3em"
        >
          <FormLabel fontWeight="600">Proposed end date</FormLabel>
          <FormLabel fontWeight="400">Date</FormLabel>
          <SimpleGrid columns={2} columnGap={16} rowGap={6} w="full">
            <GridItem colSpan={1}>
              <DatePicker
                className="frequency-date"
                editable={false}
                minDate={new Date().setDate(today.getDate())}
                value={recurringEndDate}
                onChange={handleChangeRecurringDate}
                placeholder="MM-DD-YYYY"
              />
            </GridItem>
          </SimpleGrid>
          <FormErrorMessage>
            {formErrors.recurringDonationEndDate}
          </FormErrorMessage>
        </FormControl>
      )}
      <NextButton 
        isBeingEdited={isBeingEdited}
        go={go}
        canSubmit={getSubmitState()}
        handleNext={handleNext}
        />
    </Container>
  );
};

export default SelectDateTime;
