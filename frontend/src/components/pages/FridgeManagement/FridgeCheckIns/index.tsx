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
  const [dateRange, setDateRange] = useState<DateObject[]>([
    new DateObject(),
    new DateObject(),
  ]);

  const handleDateRangeChange = (e: DateObject[]) => {
    if (e[0]) {
      const startDateState = new Date(e[0].format());
      let newStartDate = new Date();
      if (checkInFormValues.startDate) {
        newStartDate = new Date(checkInFormValues.startDate);
      }
      newStartDate.setFullYear(startDateState.getFullYear());
      newStartDate.setMonth(startDateState.getMonth());
      newStartDate.setDate(startDateState.getDate());
      console.log(newStartDate.toString());
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
      newEndDate.setFullYear(endDateState.getFullYear());
      newEndDate.setMonth(endDateState.getMonth());
      newEndDate.setDate(endDateState.getDate());
      setCheckInForm({
        target: { name: "endDate", value: newEndDate.toString() },
      });
    }
    console.log(checkInFormValues);
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
              // handleChange(e, "startTime");
            }}
            pr="3em"
          />
          <Text>to</Text>
          <Input
            type="time"
            onChange={(e: any) => {
              // handleChange(e, "endTime");
            }}
            l="3em"
          />
        </HStack>
      </FormControl>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <DatePicker
          range
          minDate={new Date()}
          value={null}
          onChange={(e: DateObject[]) => {
            // console.log(e[0].format());
            // console.log(e[1] ? e[1].format() : "end date");
            setDateRange(e);
            console.log(
              `start date: ${dateRange[0].format()}, end date: ${
                dateRange[1] ? dateRange[1].format() : "n/a"
              }`,
            );
            handleDateRangeChange(e);
          }}
          render={(
            value: string,
            openCalendar: React.MouseEventHandler<HTMLInputElement>,
          ) => {
            return (
              <HStack maxW="740px">
                <Input
                  onClick={openCalendar}
                  value={value[0]}
                  placeholder="MM-DD-YY"
                />
                <Text>to</Text>
                <Input value={value[1] ? value[1] : "MM-DD-YYYY"} disabled />
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
          // onChange={(e) => handleChange(e, "notes")}
        />
      </FormControl>
      <Button variant="navigation">Create shifts</Button>
    </Container>
  );
};

export default CreateCheckIn;
