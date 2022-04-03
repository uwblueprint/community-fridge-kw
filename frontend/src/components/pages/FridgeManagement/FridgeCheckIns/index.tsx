import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { isAfter, set } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hooks-helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../../constants/Routes";
import { CheckIn } from "../../../../types/CheckInTypes";
import ErrorMessages from "./ErrorMessages";

const checkInDefaultData = ({
  startDate: "",
  endDate: "",
  notes: "",
  isAdmin: false,
} as unknown) as CheckIn;

const CreateCheckIn = () => {
  const [checkInFormValues, setCheckInForm] = useForm(checkInDefaultData);
  const [dateRange, setDateRange] = useState<DateObject[]>([
    new DateObject(),
    new DateObject().add(1, "days"),
  ]);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [formErrors, setFormErrors] = useState({
    timeRange: "",
    dateRange: "",
  });

  const toast = useToast();
  const history = useHistory();

  const handleDateRangeChange = (e: DateObject[]) => {
    if (e[0]) {
      const startDateState = new Date(e[0].format());
      let newStartDate = new Date();
      if (checkInFormValues.startDate) {
        newStartDate = new Date(checkInFormValues.startDate);
      }
      set(newStartDate, {
        year: startDateState.getFullYear(),
        month: startDateState.getMonth(),
        date: startDateState.getDate(),
      });
      setCheckInForm({
        target: { name: "startDate", value: newStartDate.toString() },
      });
    }
    if (e[1]) {
      const endDateState = new Date(e[1].format());
      let newEndDate = new Date();
      if (checkInFormValues.endDate) {
        newEndDate = new Date(checkInFormValues.endDate);
      }
      set(newEndDate, {
        year: endDateState.getFullYear(),
        month: endDateState.getMonth(),
        date: endDateState.getDate(),
      });
      setCheckInForm({
        target: { name: "endDate", value: newEndDate.toString() },
      });
    }
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    name: string,
  ) => {
    if (name === "startDate") {
      const time = new Date(`11/11/1970 ${e.target.value}`);
      setStartTime(time);
      const newtime = set(new Date(time), {
        year: dateRange[0].year,
        month: dateRange[0].month.number - 1,
        date: dateRange[0].day,
      });

      setCheckInForm({ target: { name: "startDate", value: newtime } });
      setFormErrors({
        ...formErrors,
        timeRange: "",
      });
    } else if (name === "endDate") {
      const time = new Date(`11/11/1970 ${e.target.value}`);
      setEndTime(time);
      const newtime = set(new Date(time), {
        year: dateRange[1].year,
        month: dateRange[1].month.number - 1,
      });
      // NOTE: handles case for if end date is midnight, BUT what about HH:mm pm startTime and HH:mm am endTime?
      if (e.target.value === "00:00") {
        newtime.setDate(dateRange[1].day + 1);
        setEndTime(set(new Date(endTime!), { date: endTime!.getDate() + 1 }));
      } else {
        newtime.setDate(dateRange[1].day);
      }

      setCheckInForm({ target: { name: "endDate", value: newtime } });
      setFormErrors({
        ...formErrors,
        timeRange: "",
      });
    } else {
      // notes
      setCheckInForm({ target: { name: "notes", value: e.target.value } });
    }
  };

  const validateForm = () => {
    const newErrors = {
      timeRange: "",
      dateRange: "",
    };
    let valid = true;
    if (!startTime || !endTime) {
      valid = false;
      newErrors.timeRange = ErrorMessages.bothFieldsRequired;
    } else if (isAfter(startTime!, endTime!)) {
      valid = false;
      newErrors.timeRange = ErrorMessages.endTimeBeforeStartTime;
    }
    setFormErrors(newErrors);
    return valid;
  };

  const onSaveClick = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const res = await CheckInAPIClient.createCheckIn(checkInFormValues);
    if (!res) {
      toast({
        title: "Checkin could not be created. Please try again",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Check-ins have successfully been created",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    history.push(Routes.ADMIN_CHECK_INS);
  };

  return (
    <Container variant="responsiveContainer">
      <Text textStyle="mobileHeader2" mt="2em">
        Create new shifts
      </Text>
      <FormControl isRequired isInvalid={!!formErrors.timeRange} m="3em 0">
        <FormLabel fontWeight="600">Select time range</FormLabel>
        <HStack maxW="740px" spacing="1rem">
          <Input
            type="time"
            onChange={(e: any) => {
              handleChange(e, "startDate");
            }}
          />
          <Text>to</Text>
          <Input
            type="time"
            onChange={(e: any) => {
              handleChange(e, "endDate");
            }}
            error={formErrors.timeRange}
          />
        </HStack>
        <FormErrorMessage>{formErrors.timeRange}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <DatePicker
          range
          minDate={new Date()}
          value={null}
          onChange={(e: DateObject[]) => {
            setDateRange(e);
            handleDateRangeChange(e);
          }}
          render={(
            value: string,
            openCalendar: React.MouseEventHandler<HTMLInputElement>,
          ) => {
            return (
              <HStack maxW="740px" spacing="1rem">
                <Input
                  onClick={openCalendar}
                  value={new DateObject(value[0]).format("MMM DD, YYYY")}
                />
                <Text>to</Text>
                <Input
                  value={
                    dateRange[1]
                      ? new DateObject(dateRange[1]).format("MMM DD, YYYY")
                      : "MM/DD/YYYY"
                  }
                  disabled
                />
              </HStack>
            );
          }}
        />
      </FormControl>
      <FormControl m="3em 0">
        <FormLabel fontWeight="600">Add notes</FormLabel>
        <Textarea
          placeholder="Add any additional information here"
          maxWidth="740px"
          onChange={(e) => {
            handleChange(e, "notes");
          }}
        />
      </FormControl>
      <Button onClick={onSaveClick} variant="navigation">
        Create shifts
      </Button>
    </Container>
  );
};

export default CreateCheckIn;
