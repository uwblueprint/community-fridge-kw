import React from "react";

import { Schedule } from "../../../types/SchedulingTypes";
import CalendarInfoCard from "./CalendarInfoCard";
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
          <CalendarInfoCard
            key={JSON.stringify(schedule)}
            schedule={schedule}
            isAdminView={isAdminView}
          />
        )}
      />
    </WeeklyCalendar>
  );
};

export default Calendar;
