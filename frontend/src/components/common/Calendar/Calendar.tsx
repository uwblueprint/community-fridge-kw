import React from "react";

import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import CheckInInfoCard from "./CheckInInfoCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  schedules: Schedule[] | CheckIn[];
  isAdminView: boolean;
  isCheckInView: boolean;
};

const Calendar = ({
  selectedDay,
  schedules,
  isAdminView = false,
  isCheckInView = false,
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        schedules={schedules}
        renderItem={({ schedule }) =>
          isCheckInView ? (
            <CheckInInfoCard
              key={JSON.stringify(schedule)}
              checkIn={schedule as CheckIn}
            />
          ) : (
            <DropoffCard
              key={JSON.stringify(schedule)}
              schedule={schedule as Schedule}
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
