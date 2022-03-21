import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hooks-helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import AuthContext from "../../../../contexts/AuthContext";
import { CheckIn } from "../../../../types/CheckInTypes";

const checkInDefaultData = ({
  id: "",
  startDate: "",
  endDate: "",
  notes: "",
  isAdmin: false,
} as unknown) as CheckIn;

const CreateCheckIn = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const [checkInFormValues, setCheckInForm] = useForm(checkInDefaultData);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  console.log(startDate);
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
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <HStack maxW="740px">
          <DatePicker
            range
            placeholder={
              startDate
                ? new DateObject(startDate).format("MMMM D, YYYY")
                : "MM-DD-YYYY"
            }
            onChange={(e: any) => {
              setStartDate(e[0]);
              setEndDate(e[1]);
            }}
            format="MMMM D, YYYY"
            minDate={new Date()}
            value={null}
          />
          <Text>to</Text>
          <DatePicker
            style={{ pointerEvents: "none" }}
            placeholder={
              endDate
                ? new DateObject(endDate).format("MMMM D, YYYY")
                : "MM-DD-YYYY"
            }
          />
        </HStack>
      </FormControl>
      <FormControl m="3em 0">
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
