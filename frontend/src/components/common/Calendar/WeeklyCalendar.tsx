import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { format, setDay, startOfWeek } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

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
    <Box align="left">
      <HStack>
        <Text textStyle="desktopSubtitle">{format(currentDate, "E")} </Text>
        <Text textStyle="desktopSubtitle" color="hubbard.100" isTruncated>
          {format(currentDate, "MMM d")}
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
  handleDateChange: (days: number) => void;
  setSelectedDay: (date: Date) => void;
  calendarDate: Date;
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
  handleDateChange,
  setSelectedDay,
  calendarDate,
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
          <VStack key={i} pb="3rem" spacing="24px">
            <HStack
              justifyContent="space-between"
              alignContent="start"
              width="100%"
            >
              <HStack>
                {i === 0 && (
                  <DatePicker
                    value={calendarDate}
                    onChange={(e: DateObject) => {
                      setSelectedDay(e?.toDate?.());
                    }}
                    render={(
                      value: string,
                      openCalendar: React.MouseEventHandler<SVGElement>,
                    ) => {
                      return (
                        <CalendarIcon
                          onClick={openCalendar}
                          value={value}
                          mr="0.5rem"
                        />
                      );
                    }}
                  />
                )}
                <DayButton
                  day={{
                    day: selectedDay.getDay() + i,
                    label: getDay(selectedDay, i),
                  }}
                />
              </HStack>
              {i === 0 && (
                <HStack>
                  <IconButton
                    backgroundColor="transparent"
                    aria-label="previous day"
                    onClick={() => handleDateChange(-1)}
                  >
                    <ChevronLeftIcon w={[5, 8]} h={[5, 8]} />
                  </IconButton>
                  <IconButton
                    backgroundColor="transparent"
                    aria-label="next day"
                    onClick={() => handleDateChange(+1)}
                  >
                    <ChevronRightIcon w={[5, 8]} h={[5, 8]} />
                  </IconButton>
                </HStack>
              )}
            </HStack>
            {getFilteredDays(
              items as Array<Schedule | CheckIn>,
              selectedDay,
              i,
              renderItem,
              week,
              locale,
            )}
          </VStack>
        );
      })}
    </>
  );
}
