import { HStack, VStack } from "@chakra-ui/react";
import {
  format,
  setDay,
  startOfWeek,
} from "date-fns";
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
  // Vstack
  return (
    <div>
      <p>
        {day.label} {format(currentDate, "do", { locale })}
      </p>
    </div>
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
  const { locale } = useWeeklyCalendar();
  const daysToRender = daysInWeek({ locale });

  return (
    <div>
      <h1>{selectedDay}</h1>
      <HStack spacing="24px">
        {daysToRender.map((day) => (
          <div key={day.day}>
            <VStack>
              <DayButton day={day} />
              {events.map((item) => {
                if (item.date.getDay() !== day.day) {
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
    </div>
  );
}

export const WeeklyResponsiveContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div>{children}</div>;
};
