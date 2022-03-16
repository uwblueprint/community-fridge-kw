import {
  Button,
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";

import { Calendar } from "react-multi-date-picker";
import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
import ErrorMessages from "../../Scheduling/ErrorMessages";

const CreateCheckIn = () => {
  return (
    <Container variant="responsiveContainer">
      <Text textStyle="mobileHeader2" mt="2em">
        Create new shifts
      </Text>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select time range</FormLabel>
        <HStack maxW="740px">
          <Input type="time" pr="3em" /> <Text>to</Text>
          <Input type="time" pl="3em" />
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <HStack maxW="740px">
          <Input type="time" pr="3em" /> <Text>to</Text>
          <Input type="time" pl="3em" />
        </HStack>
        <Calendar minDate={new Date()} />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="600">Add notes</FormLabel>
        <Textarea
          placeholder="Add any additional information here"
          maxWidth="740px"
        />
      </FormControl>
      <Button variant="navigation">Create shifts</Button>
    </Container>
  );
};

export default CreateCheckIn;
