import { Container, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import { DateObject } from "react-multi-date-picker";

import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
} from "../../../types/VolunteerTypes";
import Calendar from "../../common/Calendar/Calendar";
import CalendarToggle from "../../common/Calendar/CalendarToggle";

const CheckInCalendar = ({
  isAdminView = false,
  checkIns,
  setSelectedVolunteerShift,
  navigation,
}: {
  isAdminView?: boolean;
  checkIns: CheckInWithShiftType[];
  navigation: NavigationProps;
  setSelectedVolunteerShift: (
    shift: ScheduleWithShiftType | CheckInWithShiftType,
  ) => void;
}): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<Date | DateObject | null>(
    new Date(),
  );

  return (
    <Container alignContent="left" variant="calendarContainer">
      <Flex
        pt={{ base: "0.5rem", md: "1.2rem" }}
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <CalendarToggle
          selectedDay={selectedDay}
          setSelectedDay={(day) => setSelectedDay(day)}
        />
        <Calendar
          key={selectedDay?.toString()}
          selectedDay={selectedDay as Date}
          items={checkIns}
          isAdminView={isAdminView}
          isCheckInView
          isCheckInShiftView
          navigation={navigation}
          setSelectedVolunteerShift={setSelectedVolunteerShift}
        />
      </Flex>
    </Container>
  );
};

export default CheckInCalendar;
