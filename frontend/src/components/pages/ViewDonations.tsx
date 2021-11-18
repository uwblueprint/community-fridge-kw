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
  VStack
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import AdminCalendar from "./AdminCalendar";

const ViewDonations = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());
  const [test, setTest] = useState<any>(0);

  const changeWeek = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <>
      <Stack spacing="25px">
        <Flex>
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
        />
      </Stack>
    </>
  );
};

export default ViewDonations;
