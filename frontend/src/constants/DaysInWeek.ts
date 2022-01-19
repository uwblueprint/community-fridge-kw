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
  "One time": "spinach",
  Daily: "h20",
  Weekly: "onion",
  Monthly: "turnip",
};

export const getFrequencyColor = (frequency: string): string => {
  switch (frequency) {
    case "One time":
      return "#317C71";
    case "Daily":
      return "#496DB6";
    case "Weekly":
      return "#8557BC";
    case "Monthly":
      return "#BC577B";
    default:
      return "";
  }
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
