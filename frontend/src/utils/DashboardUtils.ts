import { format, isToday, isTomorrow } from "date-fns";

/* eslint-disable-next-line import/prefer-default-export */
export const getAssistanceType = (isPickup: boolean) =>
  isPickup ? "Pickup" : "Dropoff";

export const dateHeadingText = (startDate: Date) => {
  if (isToday(startDate)) {
    return "Today";
  }
  if (isTomorrow(startDate)) {
    return "Tomorrow";
  }
  return format(startDate, "E MMM d, yyyy");
};
