import { format } from "date-fns";
import React from "react";

import { Schedule } from "../../types/SchedulingTypes";
import { WeeklyBody, WeeklyCalendar } from "../common/WeeklyCalendar";
import DefaultWeeklyEventItem from "../common/WeeklyEventItems";

type AdminCalendarProps = {
  selectedDay: Date;
  schedules: Schedule[];
};

const AdminCalendar = ({
  selectedDay,
  schedules,
}: AdminCalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
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

export default AdminCalendar;
