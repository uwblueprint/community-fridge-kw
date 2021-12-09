import { Grid, HStack, Text, useMediaQuery, VStack } from "@chakra-ui/react";
import { format, setDay, startOfWeek } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import daysInWeek from "../../../constants/DaysInWeek";
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
  const { locale, week, selectedDay } = useWeeklyCalendar();

  const currentDate = setDay(week, day.day, { locale });

  return (
    <Text textStyle="calendarDate">
      {day.label.substr(0, 3)}{" "}
      {format(currentDate, "do", { locale }).slice(0, -2)}
    </Text>
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
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { locale, week } = useWeeklyCalendar();
  const daysToRender = daysInWeek({ locale });

  return (
    <>
      {isMobile ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          {schedules.map((schedule) => {
            const scheduledDate = new Date(schedule?.startTime as string);

            if (
              schedule === null ||
              scheduledDate === null ||
              scheduledDate.getDate() !== selectedDay!.getDate() ||
              scheduledDate.getMonth() !== selectedDay!.getMonth() ||
              scheduledDate.getFullYear() !== selectedDay!.getFullYear()
            ) {
              return null;
            }

            return renderItem({
              schedule,
              showingFullWeek: selectedDay === undefined,
            });
          })}
        </Grid>
      ) : (
        <HStack align="stretch">
          {daysToRender.map((day) => (
            <div key={day.day}>
              <VStack width="10rem">
                <DayButton day={day} />
                {schedules.map((schedule) => {
                  const currentDate = setDay(week, day.day, { locale });
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
          ))}
        </HStack>
      )}
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