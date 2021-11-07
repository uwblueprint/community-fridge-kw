import {
  format,
  getDay,
  isSameDay,
  isSameWeek,
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

type WeeklyContainerProps = {
  children: ReactNode;
};

export const WeeklyContainer = ({ children }: WeeklyContainerProps) => {
  return <div>{children}</div>;
};

type DayButtonProps = {
  day: {
    day: number;
    label: string;
  };
};

const DayButton = ({ day }: DayButtonProps) => {
  const { locale, week, selectedDay, changeSelectedDay } = useWeeklyCalendar();

  const isSelected: boolean = selectedDay
    ? getDay(selectedDay) === day.day
    : false;

  const currentDate = setDay(week, day.day, { locale });

  return (
    <li>
      <div>
        <p>
          {day.label} {format(currentDate, "do", { locale })}
        </p>
      </div>
    </li>
  );
};

type WeeklyDaysProps = {
  omitDays?: number[];
};

export const WeeklyDays = ({ omitDays }: WeeklyDaysProps) => {
  const { locale } = useWeeklyCalendar();
  let daysToRender = daysInWeek({ locale });

  if (omitDays) {
    daysToRender = daysInWeek({ locale }).filter(
      (day) => !omitDays.includes(day.day),
    );
  }

  return (
    <ul>
      {daysToRender.map((day) => (
        <DayButton key={day.day} day={day} />
      ))}
    </ul>
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
  const { week, selectedDay } = useWeeklyCalendar();
  return (
    <div>
      <ul>
        {events.map((item) => {
          if (selectedDay) {
            if (!isSameDay(selectedDay, item.date)) return null;
          }

          if (!isSameWeek(week, item.date)) return null;

          return renderItem({
            item,
            showingFullWeek: selectedDay === undefined,
          });
        })}
      </ul>
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
