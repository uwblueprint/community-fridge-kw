import {
  Box,
  Button,
  CloseButton,
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
import { isAfter, isEqual, parse } from "date-fns";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../../constants/Routes";
import { CreateCheckInFields } from "../../../../types/CheckInTypes";
import ErrorMessages from "./ErrorMessages";

const CreateCheckIn = () => {
  const toast = useToast();
  const history = useHistory();
  const [dateRange, setDateRange] = useState<DateObject[]>([
    new DateObject(),
    new DateObject().add(1, "days"),
  ]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string>();
  const [formErrors, setFormErrors] = useState({
    timeRange: "",
    dateRange: "",
  });

  const validateForm = () => {
    const newErrors = {
      timeRange: "",
      dateRange: "",
    };
    let valid = true;
    if (!startTime || !endTime) {
      valid = false;
      newErrors.timeRange = ErrorMessages.bothTimeFieldsRequired;
    } else if (
      isAfter(
        parse(startTime, "HH:mm", new Date()),
        parse(endTime, "HH:mm", new Date()),
      )
    ) {
      valid = false;
      newErrors.timeRange = ErrorMessages.endTimeBeforeStartTime;
    } else if (
      isEqual(
        parse(startTime, "HH:mm", new Date()),
        parse(endTime, "HH:mm", new Date()),
      )
    ) {
      valid = false;
      newErrors.timeRange = ErrorMessages.endTimeEqualsStartTime;
    }
    if (!dateRange[0] || !dateRange[1]) {
      valid = false;
      newErrors.dateRange = ErrorMessages.bothDateFieldsRequired;
    }
    setFormErrors(newErrors);
    return valid;
  };

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }

    const checkInData: CreateCheckInFields = {
      startDate: parse(
        startTime,
        "HH:mm",
        new Date(dateRange![0].format()),
      ).toString(),
      endDate: parse(
        endTime,
        "HH:mm",
        new Date(dateRange![1].format()),
      ).toString(),
      notes,
      isAdmin: false,
    };

    const res = await CheckInAPIClient.createCheckIn(checkInData);
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
      <Box display="flex" justifyContent="right">
        <CloseButton onClick={() => history.push(Routes.ADMIN_CHECK_INS)} />
      </Box>
      <Text textStyle="mobileHeader2">Create new shifts</Text>
      <FormControl isRequired isInvalid={!!formErrors.timeRange} m="3em 0">
        <FormLabel fontWeight="600">Select time range</FormLabel>
        <HStack maxW="740px" spacing="1rem">
          <Input
            type="time"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setStartTime(e.target.value);
              setFormErrors({
                ...formErrors,
                timeRange: "",
              });
            }}
            error={formErrors.timeRange}
          />
          <Text>to</Text>
          <Input
            type="time"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEndTime(e.target.value);
              setFormErrors({
                ...formErrors,
                timeRange: "",
              });
            }}
            error={formErrors.timeRange}
          />
        </HStack>
        <FormErrorMessage>{formErrors.timeRange}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!formErrors.dateRange} m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <DatePicker
          range
          minDate={new Date()}
          value={null}
          onChange={(e: DateObject[]) => {
            setDateRange(e);
            setFormErrors({
              ...formErrors,
              dateRange: "",
            });
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
                    dateRange![1]
                      ? new DateObject(dateRange![1]).format("MMM DD, YYYY")
                      : "MM/DD/YYYY"
                  }
                  disabled
                />
              </HStack>
            );
          }}
        />
        <FormErrorMessage>{formErrors.dateRange}</FormErrorMessage>
      </FormControl>
      <FormControl m="3em 0">
        <FormLabel fontWeight="600">Add notes</FormLabel>
        <Textarea
          placeholder="Add any additional information here"
          maxWidth="740px"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNotes(e.target.value)
          }
        />
      </FormControl>
      <Button onClick={onSaveClick} variant="navigation">
        Create shifts
      </Button>
    </Container>
  );
};

export default CreateCheckIn;
