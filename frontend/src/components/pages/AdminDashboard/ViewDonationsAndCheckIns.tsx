import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Container,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import useViewport from "../../../hooks/useViewport";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import Calendar from "../../common/Calendar/Calendar";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import FridgeFoodRescueDescription from "../../common/FridgeFoodRescueDescription";
import CheckInAdminButtons from "./components/CheckInAdminButtons";

const ViewDonationsAndCheckIns = ({
  isAdminView,
  isCheckInView = false,
}: {
  isAdminView: boolean;
  isCheckInView?: boolean;
}): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());

  const { isMobile } = useViewport();
  const [test, setTest] = useState<any>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => {
    const getSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };

    const getCheckIns = async () => {
      const checkInResponse = await CheckInAPIClient.getAllCheckIns();
      setCheckIns(checkInResponse);
    };

    getSchedules();
    getCheckIns();
  }, []);

  const changeDays = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <Container alignContent="left" variant="calendarContainer">
      <Flex
        pt={{ base: "0.5rem", md: "2rem" }}
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <HStack justifyContent="space-between">
          <Text
            textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}
            pt="2rem"
          >
            {isCheckInView ? "Fridge check-ins" : "Scheduled donations"}
          </Text>

          {isCheckInView && <CheckInAdminButtons />}
        </HStack>
        {isCheckInView && <FridgeCheckInDescription />}
        {isAdminView && <FridgeFoodRescueDescription />}
        {isMobile ? (
          <HStack py="1.2rem" width="inherit" alignItems="center">
            <Text textStyle="mobileHeader4" whiteSpace="nowrap">
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
          <Flex pt="4rem" pb="2.5rem" width="inherit" alignItems="center">
            <HStack alignSelf="center">
              <Text textStyle="desktopHeader" whiteSpace="nowrap">
                {selectedDay?.toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
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
            <HStack alignSelf="center">
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
          </Flex>
        )}
        <Calendar
          key={selectedDay?.toString()}
          selectedDay={selectedDay as Date}
          items={isCheckInView ? checkIns : schedules}
          isAdminView={isAdminView}
          isCheckInView={isCheckInView}
        />
      </Flex>
    </Container>
  );
};

export default ViewDonationsAndCheckIns;
