import { Box } from "@chakra-ui/react";
import React from "react";
import { CheckIn } from "../../../types/CheckInTypes";

import CheckInInfoCard from "./CheckInInfoCard";
import { WeeklyCheckInBody, WeeklyCalendar } from "./WeeklyCalendar";

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
      <WeeklyCheckInBody
        selectedDay={selectedDay}
        checkIns={checkIns}
        renderItem={({ checkIn }) => (
          <Box display="block" pb="1.5rem" width="100%">
            <CheckInInfoCard
              key={JSON.stringify(checkIn)}
              checkIn={checkIn}
            />
          </Box>
        )}
      />
    </WeeklyCalendar>
  );
};

export default CheckInCalendar;
