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
  useToast,
} from "@chakra-ui/react";
import { endOfDay } from "date-fns";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../../constants/Routes";
import ErrorMessages from "./ErrorMessages";

const DeleteCheckInsPage = () => {
  const toast = useToast();
  const history = useHistory();
  const [dateRange, setDateRange] = useState<DateObject[]>([
    new DateObject(),
    new DateObject().add(1, "days"),
  ]);
  const [dateRangeError, setDateRangeError] = useState("");

  const validateForm = () => {
    let newError = "";
    let valid = true;
    if (!dateRange[0] || !dateRange[1]) {
      valid = false;
      newError = ErrorMessages.bothDateFieldsRequired;
    }
    setDateRangeError(newError);
    return valid;
  };

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }
    const res = await CheckInAPIClient.deleteCheckInsByDateRange(
      dateRange[0].toString(),
      endOfDay(dateRange[1].toDate()).toString(),
    );
    if (!res) {
      toast({
        title: "There are no check-ins in this date range.",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Check-in(s) have been successfully deleted",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    history.push(Routes.ADMIN_CHECK_INS);
  };

  return (
    <Container variant="responsiveContainer">
      <Text textStyle="mobileHeader2" mt="2em">
        Delete shifts
      </Text>
      <FormControl isRequired isInvalid={!!dateRangeError} m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Delete all shifts between:</FormHelperText>
        <DatePicker
          range
          minDate={new Date()}
          value={null}
          onChange={(e: DateObject[]) => {
            setDateRange(e);
            setDateRangeError("");
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
        <FormErrorMessage>{dateRangeError}</FormErrorMessage>
      </FormControl>
      <Button onClick={onSaveClick} variant="navigation">
        Delete shifts
      </Button>
    </Container>
  );
};

export default DeleteCheckInsPage;
