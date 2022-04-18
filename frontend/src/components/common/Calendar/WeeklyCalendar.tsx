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

type RenderItemProps = {
  item?: Schedule | CheckIn;
  showingFullWeek?: boolean;
  index?: number;
  emptyState: boolean;
};

type WeeklyBodyProps = {
  selectedDay: Date;
  items: Schedule[] | CheckIn[];
  renderItem: (item: RenderItemProps) => ReactNode;
};

const getFilteredDays = (
  items: Array<Schedule | CheckIn>,
  selectedDay: Date,
  i: number,
  renderItem: (item: RenderItemProps) => ReactNode,
  week: Date,
  locale?: Locale,
) => {
  const shiftsArr = items.filter((item) => {
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
      return false;
    }

    return true;
  });

  return !shiftsArr.length
    ? renderItem({ emptyState: true })
    : shiftsArr.map((item, index) => {
        return renderItem({
          item,
          showingFullWeek: selectedDay === undefined,
          index,
          emptyState: false,
        });
      });
};

export function WeeklyBody({
  selectedDay,
  items,
  renderItem,
}: WeeklyBodyProps) {
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
              {getFilteredDays(
                items as Array<Schedule | CheckIn>,
                selectedDay,
                i,
                renderItem,
                week,
                locale,
              )}
            </VStack>
          </div>
        );
      })}
    </>
  );
}
