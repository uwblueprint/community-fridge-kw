import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";
import SchedulingAPIClient from "../../APIClients/SchedulingAPIClient";
import { Schedule } from "../../types/SchedulingTypes";

import AdminCalendar from "./AdminCalendar";

const ViewDonations = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());
  const [test, setTest] = useState<any>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const getSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, []);

  const changeWeek = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <Stack spacing="1rem" mt="10rem" mx="8rem">
      <Text textStyle="desktopHeader2">
        Upcoming Scheduled Fridge Donations
      </Text>
      <Text textStyle="desktopSmall">
        Select a card to see more details pertaining to the upcoming donation.
      </Text>
      <Flex mt="5rem" width="72rem">
        <HStack>
          <Text textStyle="desktopHeader">
            Week of{" "}
            {selectedDay?.toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <DatePicker
            value={selectedDay}
            onChange={(e: DateObject) => {
              setSelectedDay(e?.toDate?.());
            }}
            render={<Icon />}
          />
        </HStack>
        <Spacer />
        <IconButton
          backgroundColor="transparent"
          aria-label="previous week"
          onClick={() => {
            changeWeek(-7);
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          backgroundColor="transparent"
          aria-label="next week"
          onClick={() => {
            changeWeek(7);
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Flex>

      <AdminCalendar
        key={selectedDay?.toString()}
        selectedDay={selectedDay as Date}
        schedules={schedules}
      />
    </Stack>
  );
};

export default ViewDonations;
