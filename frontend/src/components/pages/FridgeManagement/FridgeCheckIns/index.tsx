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
import React, { useContext } from "react";
import { useForm } from "react-hooks-helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";
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
            pr="3em"
          />
          <Text>to</Text>
          <Input
            type="time"
            onChange={(e: any) => {
              handleChange(e, "endTime");
            }}
            l="3em"
          />
        </HStack>
      </FormControl>
      <FormControl isRequired m="3em 0">
        <FormLabel fontWeight="600">Select date range</FormLabel>
        <FormHelperText mb="1em">Create shifts daily from:</FormHelperText>
        <HStack maxW="740px">
          <DatePicker
            range
            onChange={(e: any) => {
              handleChange(e[0], "startDate");
              handleChange(e[1], "endDate");
            }}
            minDate={new Date()}
            value={null}
            render={<Icon />}
          />
          <Input
            placeholder={
              checkInFormValues.startDate
                ? new DateObject(checkInFormValues.startDate).format(
                    "MMMM D, YYYY",
                  )
                : "MM-DD-YYYY"
            }
            style={{ pointerEvents: "none" }}
          />
          <Text>to</Text>
          <Input
            placeholder={
              checkInFormValues.endDate
                ? new DateObject(checkInFormValues.endDate).format(
                    "MMMM D, YYYY",
                  )
                : "MM-DD-YYYY"
            }
            style={{ pointerEvents: "none" }}
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
