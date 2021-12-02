import { format } from "date-fns";
import React from "react";

import { Schedule } from "../../../types/SchedulingTypes";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";
import DefaultWeeklyEventItem from "./WeeklyEventItems";

type CalendarProps = {
  selectedDay: Date;
  schedules: Schedule[];
};

const Calendar = ({
  selectedDay,
  schedules,
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        schedules={schedules}
        renderItem={({ schedule, showingFullWeek }) => (
          <DefaultWeeklyEventItem
            key={JSON.stringify(schedule)}
            schedule={schedule}
            date={
              showingFullWeek
                ? format(new Date(schedule!.startTime as string), "MMM do k:mm")
                : format(new Date(schedule!.startTime as string), "k:mm")
            }
          />
        )}
      />
    </WeeklyCalendar>
  );
};

export default Calendar;
