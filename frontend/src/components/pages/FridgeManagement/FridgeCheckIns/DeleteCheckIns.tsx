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
  import React, { useEffect, useState } from "react";
  import { useForm } from "react-hooks-helper";
  import DatePicker, { DateObject } from "react-multi-date-picker";
  import { useHistory } from "react-router-dom";
  import CheckInAPIClient from "../../../../APIClients/CheckInAPIClient";
  import * as Routes from "../../../../constants/Routes";
  import { CheckIn } from "../../../../types/CheckInTypes";
  
  const checkInDefaultData = {
    startDate: "",
    endDate: "",
    notes: "",
    isAdmin: false,
  } as CheckIn;
  
  const DeleteCheckInsPage = () => {
    const toast = useToast();
    const history = useHistory();
    const [checkInFormValues, setCheckInForm] = useForm(checkInDefaultData);
    const [dateRange, setDateRange] = useState<DateObject[]>([
      new DateObject(),
      new DateObject().add(1, "days"),
    ]);
    const [formErrors, setFormErrors] = useState({
      timeRange: "",
      dateRange: "",
    });
  
    useEffect(() => {
      setCheckInForm({
        target: { name: "startDate", value: new DateObject().toString() },
      });
      setCheckInForm({
        target: {
          name: "endDate",
          value: new DateObject().add(1, "days").toString(),
        },
      });
    }, []);
  
    const handleDateRangeChange = (e: DateObject[]) => {
      if (e[0]) {
        const startDateState = new Date(e[0].format());
        const newStartDate = checkInFormValues.startDate
          ? new Date(checkInFormValues.startDate)
          : new Date();
  
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
      } else {
        setCheckInForm({
          target: { name: "endDate", value: "" },
        });
      }
      setFormErrors({
        ...formErrors,
        dateRange: "",
      });
    };
  
    const validateForm = () => {
      const newErrors = {
        timeRange: "",
        dateRange: "",
      };
      let valid = true;
      if (!checkInFormValues.startDate || !checkInFormValues.endDate) {
        valid = false;
      }
      setFormErrors(newErrors);
      return valid;
    };
  
    const onSaveClick = async () => {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }
      const res = await CheckInAPIClient.deleteCheckInsByDateRange(checkInFormValues.startDate, checkInFormValues.endDate);
      if (!res) {
        toast({
          title: "Check-ins could not be deleted. Please try again",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Check-ins have successfully been deleted",
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
        <FormControl isRequired isInvalid={!!formErrors.dateRange} m="3em 0">
          <FormLabel fontWeight="600">Select date range</FormLabel>
          <FormHelperText mb="1em">Delete all shifts between:</FormHelperText>
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
          <FormErrorMessage>{formErrors.dateRange}</FormErrorMessage>
        </FormControl>
        <Button onClick={onSaveClick} variant="navigation">
          Delete shifts
        </Button>
      </Container>
    );
  };
  
  export default DeleteCheckInsPage;
  