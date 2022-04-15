import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Container,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import useViewport from "../../../hooks/useViewport";
import { CheckInWithShiftType } from "../../../types/VolunteerTypes";
import Calendar from "../../common/Calendar/Calendar";
import CheckInAdminButtons from "../AdminDashboard/components/CheckInAdminButtons";

const CheckInCalendar = ({
  isAdminView = false,
  checkIns,
  setShiftDetails,
  navigation,
}: {
  isAdminView?: boolean;
  checkIns: CheckInWithShiftType[];
  navigation: NavigationProps;
  setShiftDetails: (shiftId: string, isFoodRescue: boolean) => void;
}): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());

  const { isMobile } = useViewport();
  const [test, setTest] = useState<any>(0);

  const changeDays = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <Container alignContent="left" variant="calendarContainer">
      <Flex
        pt={{ base: "0.5rem", md: "1.2rem" }}
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <HStack justifyContent="space-between">
          {isAdminView && <CheckInAdminButtons />}
        </HStack>
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
          items={checkIns}
          isAdminView={isAdminView}
          isCheckInView
          isCheckInShiftView
          navigation={navigation}
          setShiftDetails={setShiftDetails}
        />
      </Flex>
    </Container>
  );
};

export default CheckInCalendar;
