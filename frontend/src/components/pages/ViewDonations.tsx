import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Container,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";
import SchedulingAPIClient from "../../APIClients/SchedulingAPIClient";
import { Schedule } from "../../types/SchedulingTypes";

import SchedulingAPIClient from "../../APIClients/SchedulingAPIClient";
import { Schedule } from "../../types/SchedulingTypes";
import Calendar from "../common/Calendar/Calendar";

const ViewDonations = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [test, setTest] = useState<any>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const getSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, []);

  const changeDays = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <Container
      pt="1.5rem"
      maxWidth={{ base: "default", md: "70%" }}
      px={isMobile ? "2rem" : "1rem"}
    >
      <Flex
        pt={{ base: "0.5rem", md: "2rem" }}
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <Text
          textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}
          pt="1.4rem"
        >
          Upcoming Scheduled Fridge Donations
        </Text>
        <Text textStyle={isMobile ? "mobileSmall" : "desktopSmall"} pt="1.4rem">
          Select a card to see more details pertaining to the upcoming donation.
        </Text>
        {isMobile ? (
          <HStack py="1.2rem">
            <Text textStyle="mobileHeader4">
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
            <IconButton
              backgroundColor="transparent"
              aria-label="previous week"
              onClick={() => {
                changeDays(-1);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              backgroundColor="transparent"
              aria-label="next week"
              onClick={() => {
                changeDays(1);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </HStack>
        ) : (
          <Flex pt="4rem" width="72rem">
            <HStack py="1.2rem">
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
                changeDays(-7);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              backgroundColor="transparent"
              aria-label="next week"
              onClick={() => {
                changeDays(7);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Flex>
        )}
        <Calendar
          key={selectedDay?.toString()}
          selectedDay={selectedDay as Date}
          schedules={schedules}
        />
      </Flex>
    </Container>
  );
};

export default ViewDonations;
