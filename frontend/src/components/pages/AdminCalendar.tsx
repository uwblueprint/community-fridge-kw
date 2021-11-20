import { format } from "date-fns";
import React, { useContext, useEffect } from "react";

import { WeeklyBody, WeeklyCalendar } from "../common/WeeklyCalendar";
import DefaultWeeklyEventItem from "../common/WeeklyEventItems";

type AdminCalendarProps = {
  selectedDay: Date;
};

const AdminCalendar = ({
  selectedDay,
}: AdminCalendarProps): React.ReactElement => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        events={[
          { title: "Jane doe1", date: today, frequency: "Weekly" },
          { title: "Jane doe2", date: today, frequency: "Monthly" },
          { title: "Jane doe3", date: today, frequency: "One Time" },
          { title: "Jane doe4", date: today, frequency: "Daily" },
          { title: "Jane doe1", date: tomorrow, frequency: "Weekly" },
          { title: "Jane doe2", date: tomorrow, frequency: "Monthly" },
          { title: "Jane doe3", date: tomorrow, frequency: "One Time" },
          { title: "Jane doe4", date: tomorrow, frequency: "Daily" },
        ]}
        renderItem={({ item, showingFullWeek }) => (
          <DefaultWeeklyEventItem
            key={item.date.toISOString()}
            title={item.title}
            date={
              showingFullWeek
                ? format(item.date, "MMM do k:mm")
                : format(item.date, "k:mm")
            }
            frequency={item.frequency}
          />
        )}
      />
    </WeeklyCalendar>
  );
};

export default AdminCalendar;
