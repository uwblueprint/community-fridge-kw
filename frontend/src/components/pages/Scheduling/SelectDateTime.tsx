import "react-multi-date-picker/styles/layouts/mobile.css";
import "./selectDateTime.css";

import {
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { endOfDay, format, isAfter, parse } from "date-fns";
import React, { useContext, useState } from "react";
import DatePicker, { Calendar, DateObject } from "react-multi-date-picker";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import useViewport from "../../../hooks/useViewport";
import { Schedule } from "../../../types/SchedulingTypes";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ModifyRecurringDonationModal from "../Dashboard/components/ModifyRecurringDonationModal";
import BackButton from "./BackButton";
import CancelButton from "./CancelEditsButton";
import ErrorMessages from "./ErrorMessages";
import NextButton from "./NextButton";
import SaveButton from "./SaveChangesButton";
import {
  convertFrequencyString,
  dayParts,
  DonationFrequency,
  frequencies,
  getTimeSlot,
  SchedulingStepProps,
} from "./types";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formErrors, setFormErrors] = useState({
    date: "",
    dayPart: "",
    timeRange: "",
    frequency: "",
    recurringDonationEndDate: "",
  });

  const { authenticatedUser } = useContext(AuthContext);

  const { isDesktop } = useViewport();

  const get12HTimeString = (time: string) => {
    const time24Hour = `${new Date(time).getHours().toString()}:00`;
    if (time24Hour === "NaN:00") {
      return "";
    }
    return format(parse(time24Hour, "HH:mm", new Date()), "h:mm a");
  };

  const getSubmitState = () => {
    const filled = !!dayPart && !!startTime && !!endTime && !!frequency;
    return frequency === DonationFrequency.ONE_TIME
      ? filled
      : filled && !!recurringDonationEndDate;
  };

  // setting state initial values
  const [date, setDate] = useState<Date>(new Date(startTime));
  const [timeRange, setTimeRange] = useState(
    `${get12HTimeString(startTime)} - ${get12HTimeString(endTime)}`,
  );
  const [showTimeSlots, setShowTimeSlots] = useState<string[] | null>(
    getTimeSlot(dayPart),
  );
  const [showTimeofDay, setShowTimeofDay] = useState<boolean>(false);

  const [icons, setIcons] = useState<number[]>([0, 0, 0, 0, 0]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [recurringEndDate, setRecurringEndDate] = useState<Date>(
    new Date(recurringDonationEndDate),
  );

  const getFrequencyLabels = () => {
    const newFrequencyLabels = [...frequencies];
    newFrequencyLabels.forEach((freq, i) => {
      if (freq === DonationFrequency.WEEKLY) {
        newFrequencyLabels[i] = `Weekly on ${format(new Date(date), "EEEE")}s`;
      } else if (freq === DonationFrequency.MONTHLY) {
        newFrequencyLabels[i] = `Monthly (every 4 weeks) on  ${format(
          new Date(date),
          "EEEE",
        )}s`;
      }
    });
    return newFrequencyLabels;
  };

  const convert = (freq: string) => {
    let freqReturn = freq;
    if (freq === DonationFrequency.WEEKLY) {
      freqReturn = `Weekly on ${format(new Date(date), "EEEE")}s`;
    } else if (freq === DonationFrequency.MONTHLY) {
      freqReturn = `Monthly (every 4 weeks) on  ${format(
        new Date(date),
        "EEEE",
      )}s`;
    }
    return freqReturn;
  };

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
        if (
          new Date(schedule.startTime).toDateString() ===
          selectedDate.toDateString()
        ) {
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
      setTimeRange("");
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
    const convertedStartTime = format(
      parse(tokens[0], "h:mm a", new Date()),
      "HH:mm",
    );
    const convertedEndTime = format(
      parse(tokens[1], "h:mm a", new Date()),
      "HH:mm",
    );

    const newStartTime = new Date(`11/11/1970 ${convertedStartTime}`);
    const newEndTime = new Date(`11/11/1970 ${convertedEndTime}`);
    newStartTime.setFullYear(date.getFullYear());
    newStartTime.setMonth(date.getMonth());
    newStartTime.setDate(date.getDate());

    newEndTime.setFullYear(date.getFullYear());
    newEndTime.setMonth(date.getMonth());
    if (convertedEndTime === "00:00") {
      // for midnight edge case
      newEndTime.setDate(date.getDate() + 1);
    } else {
      newEndTime.setDate(date.getDate());
    }

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
    setShowTimeofDay(true);
    setShowTimeSlots(getTimeSlot("")); // reset timeslots
    setForm({ target: { name: "dayPart", value: "" } }); // reset daypart
    setForm({ target: { name: "startTime", value: "" } });
    setForm({ target: { name: "endTime", value: "" } });

    if (!isBeingEdited) {
      setForm({ target: { name: "frequency", value: "" } });
    }

    setFormErrors({
      ...formErrors,
      date: "",
    });
  };

  const handleChangeRecurringDate = (selectedDate: DateObject) => {
    const selectedDateObj = selectedDate.toDate();
    setRecurringEndDate(selectedDateObj);
    const recurringDate = endOfDay(new Date(selectedDateObj));
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
    const startTimeDate = new Date(startTime);
    const currentTime = new Date();
    if (startTimeDate < currentTime) {
      valid = false;
      newErrors.timeRange = ErrorMessages.invalidStartTime;
    }
    if (!frequency) {
      valid = false;
      newErrors.frequency = ErrorMessages.requiredField;
    } else if (frequency !== DonationFrequency.ONE_TIME) {
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

        if (isAfter(startDateVal, recurringEndDateVal)) {
          valid = false;
          newErrors.recurringDonationEndDate =
            ErrorMessages.recurringEndDateAfterStartDate;
        } else if (isAfter(recurringEndDateVal, maxRecurringEndDateVal)) {
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

  const discardChanges = async () => {
    const scheduleResponse = await SchedulingAPIClient.getScheduleById(id);

    setForm({ target: { name: "dayPart", value: scheduleResponse.dayPart } });
    setForm({
      target: { name: "frequency", value: scheduleResponse.frequency },
    });
    setForm({
      target: { name: "startTime", value: scheduleResponse.startTime },
    });
    setForm({ target: { name: "endTime", value: scheduleResponse.endTime } });
    setForm({
      target: {
        name: "recurringDonationEndDate",
        value: scheduleResponse.recurringDonationEndDate,
      },
    });

    return go && go("confirm donation details");
  };

  const onSaveRecurringClick = () => {
    if (!validateForm()) {
      return;
    }
    onOpen();
  };

  const onSaveClick = async (isOneTimeEvent = true) => {
    if (!validateForm()) {
      return;
    }
    const editedFields = {
      dayPart,
      startTime,
      endTime,
    };
    if (isOneTimeEvent) {
      const res = await SchedulingAPIClient.updateSchedule(id, editedFields);
      if (!res) {
        toast({
          title: "Drop-off information could not be updated. Please try again",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
        return;
      }
    }
    toast({
      title: "Drop-off information updated successfully",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    discardChanges();
  };

  const today = new Date();
  const getMaxDate = () => {
    const diff = today.getDate() + 13;
    return new Date(today.setDate(diff));
  };

  return (
    <Container variant="responsiveContainer" pb={{ lg: "0px", base: "100px" }}>
      {isBeingEdited ? (
        <CancelButton discardChanges={discardChanges} />
      ) : (
        <>
          <SchedulingProgressBar activeStep={0} totalSteps={4} />
          <BackButton previous={previous} />
        </>
      )}
      <Text textStyle="mobileHeader2" mt="2em" mb="1em">
        Date and time
      </Text>
      <FormControl isRequired isInvalid={!!formErrors.date}>
        <FormLabel fontWeight="600">Select date</FormLabel>
        <Calendar
          className={isDesktop ? "rmdp-mobile desktop" : "rmdp-mobile"}
          minDate={new Date()}
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
      {!!dayPart && showTimeSlots && (
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
      {!!startTime && !!dayPart && (
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
            value={convert(frequency)}
            values={getFrequencyLabels()}
            icons={[]}
            isRequired
            isDisabled={isBeingEdited}
            error={formErrors.frequency}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(convertFrequencyString(e.toString()), "frequency");
            }}
          />
          <FormErrorMessage>{formErrors.frequency}</FormErrorMessage>
        </FormControl>
      )}
      {!!frequency &&
        frequency !== DonationFrequency.ONE_TIME &&
        !!startTime &&
        !!dayPart && (
          <FormControl
            isRequired
            isInvalid={!!formErrors.recurringDonationEndDate}
            isDisabled={isBeingEdited}
            mb="3em"
          >
            <FormLabel fontWeight="600">Proposed end date</FormLabel>
            <FormLabel fontWeight="400">Date</FormLabel>
            <SimpleGrid columns={2} columnGap={16} rowGap={6} w="full">
              <GridItem colSpan={1}>
                <DatePicker
                  disabled={isBeingEdited}
                  className="frequency-date"
                  editable={false}
                  minDate={new Date(startTime)}
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
      {isBeingEdited ? (
        <>
          {formValues.recurringDonationId !== "null" ? (
            <>
              <SaveButton onSaveClick={onSaveRecurringClick} />
              <ModifyRecurringDonationModal
                isOpen={isOpen}
                onClose={onClose}
                onModification={onSaveClick}
                modificationType="update"
                isRecurringDisabled
              />
            </>
          ) : (
            <SaveButton onSaveClick={onSaveClick} />
          )}
        </>
      ) : (
        <NextButton canSubmit={getSubmitState()} handleNext={handleNext} />
      )}
    </Container>
  );
};

export default SelectDateTime;
