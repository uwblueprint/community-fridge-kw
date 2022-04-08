import React from "react";

import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import CheckInInfoCard from "../../pages/AdminDashboard/components/CheckInInfoCard";
import DropoffCard from "../../pages/Dashboard/components/DropoffCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  items: Schedule[] | CheckIn[];
  isAdminView: boolean;
  isCheckInView: boolean;
  deleteCheckIn: (checkInId: string) => void;
};

const Calendar = ({
  selectedDay,
  items,
  isAdminView = false,
  isCheckInView = false,
  deleteCheckIn,
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        items={items}
        renderItem={({ item }) =>
          isCheckInView ? (
            <CheckInInfoCard
              key={JSON.stringify(item)}
              checkIn={item as CheckIn}
              deleteCheckIn={deleteCheckIn}
            />
          ) : (
            <DropoffCard
              key={JSON.stringify(item)}
              schedule={item as Schedule}
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
