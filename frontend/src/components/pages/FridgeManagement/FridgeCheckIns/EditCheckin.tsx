import {
  Button,
  Center,
  CloseButton,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { format, isAfter, isEqual, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../../constants/Routes";
import { UpdateCheckInFields } from "../../../../types/CheckInTypes";
import ErrorMessages from "./ErrorMessages";

const EditCheckInPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [notes, setNotes] = useState<string | undefined>("");
  const [timeRangeError, setTimeRangeError] = useState("");
  const toast = useToast();
  const history = useHistory();

  const getCheckInData = async () => {
    const checkInResponse = await CheckInAPIClient.getCheckInsById(id);
    setDate(checkInResponse.startDate);
    setStartTime(format(new Date(checkInResponse.startDate), "HH:mm"));
    setEndTime(format(new Date(checkInResponse.endDate), "HH:mm"));
    setNotes(checkInResponse.notes);
  };

  const validateForm = () => {
    let newError = "";
    let valid = true;
    const parsedStartTime = parse(startTime, "HH:mm", new Date());
    const parsedEndTime = parse(endTime, "HH:mm", new Date());

    if (isAfter(parsedStartTime, parsedEndTime)) {
      valid = false;
      newError = ErrorMessages.endTimeBeforeStartTime;
    } else if (isEqual(parsedStartTime, parsedEndTime)) {
      valid = false;
      newError = ErrorMessages.endTimeEqualsStartTime;
    }

    setTimeRangeError(newError);
    return valid;
  };

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }

    const checkInData: UpdateCheckInFields = {
      startDate: parse(startTime, "HH:mm", new Date(date)).toString(),
      endDate: parse(endTime, "HH:mm", new Date(date)).toString(),
      notes,
    };

    const res = await CheckInAPIClient.updateCheckInById(id, checkInData);

    if (!res) {
      toast({
        title: "Checkin could not be updated. Please try again",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Check-in has been successfully updated",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    history.push(Routes.ADMIN_CHECK_INS);
  };

  useEffect(() => {
    getCheckInData();
  }, []);

  if (!date || !startTime || !endTime) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Container variant="responsiveContainer">
      <Flex justify="flex-end">
        <CloseButton
          onClick={() => history.push(Routes.ADMIN_CHECK_INS)}
          variant="cancelNavigation"
          size="lg"
        />
      </Flex>
      <Text textStyle="mobileHeader2">Edit shift</Text>
      <Text textStyle="mobileSmall" pt="1em">
        {format(new Date(date), "EEEE, MMMM d, yyyy")}
      </Text>
      <FormControl isRequired isInvalid={!!timeRangeError} m="3em 0">
        <FormLabel fontWeight="600">Edit time range</FormLabel>
        <HStack maxW="740px" spacing="1rem">
          <Input
            value={startTime}
            type="time"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setStartTime(e.target.value);
              setTimeRangeError("");
            }}
            error={timeRangeError}
          />
          <Text>to</Text>
          <Input
            value={endTime}
            type="time"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEndTime(e.target.value);
              setTimeRangeError("");
            }}
            error={timeRangeError}
          />
        </HStack>
        <FormErrorMessage>{timeRangeError}</FormErrorMessage>
      </FormControl>
      <FormControl m="3em 0">
        <FormLabel fontWeight="600">Edit notes</FormLabel>
        <Textarea
          value={notes}
          maxWidth="740px"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNotes(e.target.value);
          }}
        />
      </FormControl>
      <Button
        onClick={onSaveClick}
        variant="navigation"
        width={["100%", "30%"]}
      >
        Modify shift
      </Button>
    </Container>
  );
};

export default EditCheckInPage;
