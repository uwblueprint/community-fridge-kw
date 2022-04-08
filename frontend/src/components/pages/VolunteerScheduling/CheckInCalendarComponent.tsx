import React from "react";

import { CheckInWithShiftType } from "../../../types/VolunteerTypes";
import { WeeklyBody, WeeklyCalendar } from "../../common/Calendar/WeeklyCalendar";

type CheckInCalendarProps = {
  selectedDay: Date;
  checkIns: CheckInWithShiftType[];
  setShiftId: React.Dispatch<string>;
  setIsFoodRescue: React.Dispatch<boolean>
  navigation: any; // change
};

const CheckInCalendarComponent = ({
  selectedDay,
  checkIns,
  setShiftId,
  setIsFoodRescue,
  navigation
}: CheckInCalendarProps): React.ReactElement => {
  return (
      <p>
        let's leave something cool here
      </p>
    // <WeeklyCalendar week={selectedDay}>
    //   <WeeklyBody
    //     selectedDay={selectedDay}
    //     items={checkIns}
    //     renderItem={({ checkInObject: CheckInWithShiftType, id }) => (
    //     <ShiftCard
    //         key={id}
    //         shift={checkInObject}
    //         setShiftId={setShiftId}
    //         navigation={navigation}
    //         isSignUp
    //         setIsFoodRescue={setIsFoodRescue}
    //     />   
    //     )}
    //   />
    // </WeeklyCalendar>
  );
};

export default CheckInCalendarComponent;
