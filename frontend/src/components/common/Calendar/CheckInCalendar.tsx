import { Box } from "@chakra-ui/react";
import React from "react";

import { CheckIn } from "../../../types/CheckInTypes";
import CheckInInfoCard from "./CheckInInfoCard";
import { WeeklyBody, WeeklyCalendar } from "./WeeklyCalendar";

type CalendarProps = {
  selectedDay: Date;
  checkIns: CheckIn[];
};

const CheckInCalendar = ({
  selectedDay,
  checkIns,
}: CalendarProps): React.ReactElement => {
  return (
    <WeeklyCalendar week={selectedDay}>
      <WeeklyBody
        selectedDay={selectedDay}
        schedules={checkIns}
        renderItem={({ schedule }) => (
          <Box display="block" pb="1.5rem" width="100%">
            <CheckInInfoCard
              key={JSON.stringify(schedule)}
              checkIn={schedule as CheckIn}
            />
          </Box>
        )}
      />
    </WeeklyCalendar>
  );
};

export default CheckInCalendar;
