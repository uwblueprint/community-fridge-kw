import { Box, Divider, Text } from "@chakra-ui/react";
import { add } from "date-fns";
import React from "react";
import { NavigationProps } from "react-hooks-helper";

import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
} from "../../../types/VolunteerTypes";
import CheckInInfoCard from "../../pages/AdminDashboard/components/CheckInInfoCard";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import ShiftCard from "../../pages/VolunteerDashboard/ShiftCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar"; /*  */

type CalendarProps = {
  selectedDay: Date;
  setSelectedDay: (date: Date) => void;
  items: Schedule[] | CheckIn[];
  isAdminView: boolean;
  isCheckInView: boolean;
  isCheckInShiftView?: boolean;
  navigation?: NavigationProps;
  setSelectedVolunteerShift?: (
    shift: ScheduleWithShiftType | CheckInWithShiftType,
  ) => void;
  deleteCheckIn?: any;
};

const Calendar = ({
  selectedDay,
  setSelectedDay,
  items,
  isAdminView = false,
  isCheckInView = false,
  isCheckInShiftView = false,
  navigation,
  setSelectedVolunteerShift,
  deleteCheckIn,
}: CalendarProps): React.ReactElement => {
  const [currentDate, setCurrentDate] = React.useState(selectedDay);

  const handleDateChange = (days: number) => {
    setSelectedDay(add(currentDate as Date, { days }));
    setCurrentDate(add(currentDate as Date, { days }));
  };

  const getCheckInCard = (item: any, index: number) => {
    if (isCheckInShiftView) {
      return (
        <>
          <ShiftCard
            key={JSON.stringify(item)}
            shift={item}
            navigation={navigation}
            isSignUp
            setSelectedVolunteerShift={setSelectedVolunteerShift}
          />
          {index < items.length - 1 && <Divider pt="0.5rem" />}
        </>
      );
    }
    return (
      <CheckInInfoCard
        key={JSON.stringify(item)}
        checkIn={item as CheckIn}
        deleteCheckIn={deleteCheckIn}
      />
    );
  };
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        items={items}
        renderItem={({ item, index, emptyState }) => {
          if (emptyState) {
            return (
              <Box
                width="100%"
                backgroundColor="squash.100"
                padding={{ base: "0px", md: "3rem" }}
                textAlign="center"
              >
                <Text
                  p={{ base: "28px", md: "0px" }}
                  color="black.500"
                  textStyle="mobileBody"
                >
                  No shifts scheduled.
                </Text>
              </Box>
            );
          }

          return isCheckInView ? (
            getCheckInCard(item, index as number)
          ) : (
            <DropoffCard
              key={JSON.stringify(item)}
              schedule={item as Schedule}
              isDonorView={false}
              isPublicView={!isAdminView}
            />
          );
        }}
        calendarDate={currentDate}
        setSelectedDay={setSelectedDay}
        handleDateChange={handleDateChange}
      />
    </WeeklyCalendar>
  );
};

export default Calendar;
