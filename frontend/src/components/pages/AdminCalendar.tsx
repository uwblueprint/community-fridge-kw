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
          { title: "Jane doe1", date: today },
          { title: "Jane doe3", date: tomorrow },
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
          />
        )}
      />
    </WeeklyCalendar>
  );
};

export default AdminCalendar;
