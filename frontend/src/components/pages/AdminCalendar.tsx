import { format } from "date-fns";
import React, { useContext } from "react";

import {
  WeeklyBody,
  WeeklyCalendar
} from "../common/WeeklyCalendar";
import DefaultWeeklyEventItem from "../common/WeeklyEventItems";

const AdminCalendar = (): React.ReactElement => {
  return (
    <>
      <WeeklyCalendar week={new Date()}>
        <WeeklyBody
          events={[{ title: "Jane doe", date: new Date() }]}
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
    </>
  );
};

export default AdminCalendar;
