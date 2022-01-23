import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { format, setDay, startOfWeek } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import useViewport from "../../../hooks/useViewport";
import { Schedule } from "../../../types/SchedulingTypes";

type State = {
  week: Date;
  selectedDay?: Date;
  locale?: Locale;
  changeSelectedDay: (day?: Date) => any;
};

const WeeklyContext = React.createContext<State>({} as State);

export const useWeeklyCalendar = () => useContext(WeeklyContext);

type WeeklyCalendarProps = {
  week: Date;
  children: ReactNode;
  locale?: Locale;
};

export const WeeklyCalendar = ({
  locale,
  week,
  children,
}: WeeklyCalendarProps): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<Date>();

  useEffect(() => {
    setSelectedDay(undefined);
  }, [week]);

  return (
    <WeeklyContext.Provider
      value={{
        locale,
        selectedDay,
        week: startOfWeek(week),
        changeSelectedDay: setSelectedDay,
      }}
    >
      {children}
    </WeeklyContext.Provider>
  );
};

type DayButtonProps = {
  day: {
    day: number;
    label: string;
  };
};

const DayButton = ({ day }: DayButtonProps) => {
  const { locale, week } = useWeeklyCalendar();

  const currentDate = setDay(week, day.day, { locale });

  return (
    <Box align="left" width="100%" pb="2rem">
      <HStack>
        <Text textStyle="desktopHeader">{day.label.substr(0, 3)} </Text>
        <Text textStyle="desktopHeader" color="hubbard.100">
          {format(currentDate, "do", { locale }).slice(0, -2)}
        </Text>
      </HStack>
    </Box>
  );
};

type RenderItemProps<EventItem> = {
  schedule: Schedule;
  showingFullWeek: boolean;
};

type WeeklyBodyProps<EventItem> = {
  selectedDay: Date;
  schedules: Schedule[];
  renderItem: (item: RenderItemProps<EventItem>) => ReactNode;
};

export function WeeklyBody<EventItem>({
  selectedDay,
  schedules,
  renderItem,
}: WeeklyBodyProps<EventItem>) {
  const { isMobile } = useViewport();
  const { locale, week } = useWeeklyCalendar();

  const getDay = (datePassed: Date, i: number): string => {
    const datePassedDay = datePassed.getDay();
    const updatedDay = (datePassedDay + i) % 7;

    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    return days[updatedDay];
  };

  return (
    <>
      {[...Array(isMobile ? 1 : 3)].map((_, i) => {
        return (
          <div key={i}>
            <VStack justifyItems="flex-start" alignContent="start" pb="5rem">
              <DayButton
                day={{
                  day: selectedDay.getDay() + i,
                  label: getDay(selectedDay, i),
                }}
              />

              {schedules.map((schedule) => {
                const currentDate = setDay(week, selectedDay.getDay() + i, {
                  locale,
                });
                const scheduledDate = new Date(schedule?.startTime as string);

                if (
                  schedule === null ||
                  scheduledDate === null ||
                  scheduledDate.getDate() !== currentDate.getDate() ||
                  scheduledDate.getMonth() !== currentDate.getMonth() ||
                  scheduledDate.getFullYear() !== currentDate.getFullYear()
                ) {
                  return null;
                }

                return renderItem({
                  schedule,
                  showingFullWeek: selectedDay === undefined,
                });
              })}
            </VStack>
          </div>
        );
      })}
    </>
  );
}

export const WeeklyResponsiveContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div>{children}</div>;
};
