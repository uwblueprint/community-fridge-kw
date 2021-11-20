import { Locale } from "date-fns";
import { enUS } from "date-fns/locale";

export const colorMap = {
  "One Time": "spinach",
  "Daily": "H2O",
  "Weekly": "onion",
  "Monthly": "turnip",
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
