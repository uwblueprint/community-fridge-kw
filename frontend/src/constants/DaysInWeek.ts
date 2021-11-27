import { Locale } from "date-fns";
import { enUS } from "date-fns/locale";

export const convertTime = (dateToConvert: string): string => {
  return new Date(dateToConvert).toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const colorMap = {
  "One Time": "spinach",
  Daily: "H2O",
  Weekly: "onion",
  Monthly: "turnip",
};

export const getNextDropOff = (currentDate: string, frequency: string): string => {
  const nextDate = new Date(currentDate);
  
  if (frequency === "Daily") {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (frequency === "Weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "Monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    return "";
  }

  const nextTime = nextDate.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return `Next dropoff: ${nextTime}`;
};

export const getNextDropOff = (currentDate: string, frequency: string): string => {
  const nextDate = new Date(currentDate);
  
  if (frequency === "Daily") {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (frequency === "Weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "Monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    return "";
  }

  return nextDate.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
};

type DaysInWeekProps = {
  locale?: Locale;
};

const daysInWeek = ({ locale = enUS }: DaysInWeekProps) => [
  { day: 0, label: locale.localize?.day(0) },
  { day: 1, label: locale.localize?.day(1) },
  { day: 2, label: locale.localize?.day(2) },
  { day: 3, label: locale.localize?.day(3) },
  { day: 4, label: locale.localize?.day(4) },
  { day: 5, label: locale.localize?.day(5) },
  { day: 6, label: locale.localize?.day(6) },
];

export default daysInWeek;
