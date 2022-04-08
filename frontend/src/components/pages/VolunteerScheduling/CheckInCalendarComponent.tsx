import React from "react";

import { CheckInWithShiftType } from "../../../types/VolunteerTypes";
import { WeeklyBody, WeeklyCalendar } from "../../common/Calendar/WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  checkIns: CheckInWithShiftType[];
  setShiftId: React.Dispatch<string>;
  setIsFoodRescue: React.Dispatch<boolean>
  navigation: any; // change type
};

const CheckInCalendarComponent = ({
  selectedDay,
  checkIns,
  setShiftId,
  setIsFoodRescue,
  navigation
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      {/* <WeeklyBody
        selectedDay={selectedDay}
        items={checkIns}
        renderItem={({ checkInObject: CheckInWithShiftType, id }) => (
        <ShiftCard
            key={id}
            shift={checkInObject}
            setShiftId={setShiftId}
            navigation={navigation}
            isSignUp
            setIsFoodRescue={setIsFoodRescue}
        />   
        )}
      /> */}
    </WeeklyCalendar>
  );
};

export default CheckInCalendarComponent;
