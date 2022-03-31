import React from "react";

import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  schedules: Schedule[];
  isAdminView: boolean;
};

const Calendar = ({
  selectedDay,
  schedules,
  isAdminView,
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        schedules={schedules}
        renderItem={({ schedule }) => (
          <DropoffCard
            key={JSON.stringify(schedule)}
            schedule={schedule as Schedule}
            isDonorView={false}
            isPublicView={!isAdminView}
          />
        )}
      />
    </WeeklyCalendar>
  );
};

export default Calendar;
