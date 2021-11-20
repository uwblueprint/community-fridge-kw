import { HStack, Text, VStack } from "@chakra-ui/react";
import { format, setDay, startOfWeek } from "date-fns";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import daysInWeek from "../../constants/DaysInWeek";

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
      {day.label.substr(0, 3)} {format(currentDate, "do", { locale }).slice(0, -2)}
    </Text>
  );
};

type RenderItemProps<EventItem> = {
  item: EventItem & { date: Date };
  showingFullWeek: boolean;
};

type WeeklyBodyProps<EventItem> = {
  events: (EventItem & { date: Date })[];
  renderItem: (item: RenderItemProps<EventItem>) => ReactNode;
};

export function WeeklyBody<EventItem>({
  events,
  renderItem,
}: WeeklyBodyProps<EventItem>) {
  const { selectedDay } = useWeeklyCalendar();
  const { locale, week } = useWeeklyCalendar();
  const daysToRender = daysInWeek({ locale });

  return (
    <HStack align="stretch">
      {daysToRender.map((day) => (
        <div key={day.day}>
          <VStack width="10rem">
            <DayButton day={day} />
            {events.map((item) => {
              const currentDate = setDay(week, day.day, { locale });

              if (
                item.date.getDate() !== currentDate.getDate() ||
                item.date.getMonth() !== currentDate.getMonth() ||
                item.date.getFullYear() !== currentDate.getFullYear()
              ) {
                return null;
              }

              return renderItem({
                item,
                showingFullWeek: selectedDay === undefined,
              });
            })}
          </VStack>
        </div>
      ))}
    </HStack>
  );
}

export const WeeklyResponsiveContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div>{children}</div>;
};
