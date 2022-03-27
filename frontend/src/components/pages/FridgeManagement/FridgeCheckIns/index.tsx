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
  const [dates, setDates] = useState([new DateObject()]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    console.log(e.target.value);
    // if (name === "startDate") {
    //   // set date portion of startDate in form
    //   if (checkInFormValues.startDate) {
    //   }
    // } else if (name === "endDate") {
    //   // placeholder
    // } else if (name === "startTime") {
    //   // placeholder
    // } else if (name === "endTime") {
    //   // placeholder
    // }
    // setCheckInForm({ target: { name, value: e } });
  };
  return (
    <Container variant="responsiveContainer">
      <Text textStyle="mobileHeader2" mt="2em">
        Create new shifts
      </Text>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select time range</FormLabel>
        <HStack maxW="740px">
          <Input
            type="time"
            onChange={(e: any) => {
              handleChange(e, "startTime");
            }}
          />
          <Text>to</Text>
          <Input
            type="time"
            onChange={(e: any) => {
              handleChange(e, "endTime");
            }}
          />
        </HStack>
      </FormControl>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <DatePicker
          range
          minDate={new Date()}
          value={dates}
          onChange={(e: DateObject[]) => {
            setDates(e);
          }}
          render={(value: string, openCalendar: React.MouseEventHandler<HTMLInputElement>) => {
            return (
              <HStack maxW="740px">
                <Input
                  onClick={openCalendar}
                  value={value[0]}
                />
                <Text>to</Text>
                <Input
                  value={value[1] || "MM-DD-YYYY"}
                  disabled
                />
              </HStack>
            )
          }}
        />
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
