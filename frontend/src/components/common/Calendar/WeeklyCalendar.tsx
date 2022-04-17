import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { format, setDay, startOfWeek } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import useViewport from "../../../hooks/useViewport";
import { CheckIn } from "../../../types/CheckInTypes";
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
    <Box align="left" width="100%" pb="1rem">
      <HStack>
        <Text textStyle="desktopSubtitle">{format(currentDate, "E")} </Text>
        <Text textStyle="desktopSubtitle" color="hubbard.100">
          {format(currentDate, "MMM d")}
        </Text>
      </HStack>
    </Box>
  );
};

type RenderItemProps<EventItem> = {
  item: Schedule | CheckIn;
  showingFullWeek: boolean;
  index: number;
};

type WeeklyBodyProps<EventItem> = {
  selectedDay: Date;
  items: Schedule[] | CheckIn[];
  renderItem: (item: RenderItemProps<EventItem>) => ReactNode;
};

export function WeeklyBody<EventItem>({
  selectedDay,
  items,
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
            <VStack
              justifyItems="flex-start"
              alignContent="start"
              pb="3rem"
              width="100%"
            >
              <DayButton
                day={{
                  day: selectedDay.getDay() + i,
                  label: getDay(selectedDay, i),
                }}
              />

              {(items as Array<Schedule | CheckIn>).map((item, index) => {
                const currentDate = setDay(week, selectedDay.getDay() + i, {
                  locale,
                });
                const scheduledDate =
                  "startTime" in item
                    ? new Date(item?.startTime as string)
                    : new Date(item?.startDate as string);

                if (
                  item === null ||
                  scheduledDate === null ||
                  scheduledDate.getDate() !== currentDate.getDate() ||
                  scheduledDate.getMonth() !== currentDate.getMonth() ||
                  scheduledDate.getFullYear() !== currentDate.getFullYear()
                ) {
                  return null;
                }

                return renderItem({
                  item,
                  showingFullWeek: selectedDay === undefined,
                  index,
                });
              })}
            </VStack>
          </div>
        );
      })}
    </>
  );
}
