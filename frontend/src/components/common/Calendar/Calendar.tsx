import React from "react";
import { NavigationProps } from "react-hooks-helper";

import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import CheckInInfoCard from "../../pages/AdminDashboard/components/CheckInInfoCard";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import ShiftCard from "../../pages/VolunteerDashboard/ShiftCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  items: Schedule[] | CheckIn[];
  isAdminView: boolean;
  isCheckInView: boolean;
  isCheckInShiftView?: boolean;
  setShiftId?: any;
  navigation?: NavigationProps;
  setIsFoodRescue?: any;
  isSignUp?: any;
};

const Calendar = ({
  selectedDay,
  items,
  isAdminView = false,
  isCheckInView = false,
  isCheckInShiftView = false,
  setShiftId,
  navigation,
  setIsFoodRescue,
  isSignUp,
}: CalendarProps): React.ReactElement => {
  const getCheckInCard = (item: any) => {
    if (isCheckInShiftView) {
      return (
        <ShiftCard
          key={JSON.stringify(item)}
          shift={item}
          setShiftId={setShiftId}
          navigation={navigation}
          isSignUp
          setIsFoodRescue={setIsFoodRescue}
        />
      );
    }
    return (
      <CheckInInfoCard key={JSON.stringify(item)} checkIn={item as CheckIn} />
    );
  };
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        items={items}
        renderItem={({ item }) =>
          isCheckInView ? (
            getCheckInCard(item)
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
