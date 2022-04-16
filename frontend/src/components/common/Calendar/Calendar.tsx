import { Divider } from "@chakra-ui/react";
import React from "react";
import { NavigationProps } from "react-hooks-helper";

import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import { ScheduleWithShiftType, CheckInWithShiftType } from "../../../types/VolunteerTypes";
import CheckInInfoCard from "../../pages/AdminDashboard/components/CheckInInfoCard";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import ShiftCard from "../../pages/VolunteerDashboard/ShiftCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar"; /*  */

type CalendarProps = {
  selectedDay: Date;
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
  items,
  isAdminView = false,
  isCheckInView = false,
  isCheckInShiftView = false,
  navigation,
  setSelectedVolunteerShift,
  deleteCheckIn,
}: CalendarProps): React.ReactElement => {
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
        renderItem={({ item, index }) =>
          isCheckInView ? (
            getCheckInCard(item, index)
          ) : (
            <DropoffCard
              key={JSON.stringify(item)}
              schedule={item as Schedule}
              isDonorView={false}
              isPublicView={!isAdminView}
            />
          )
        }
      />
    </WeeklyCalendar>
  );
};

export default Calendar;
