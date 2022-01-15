import { NavigationProps, SetForm } from "react-hooks-helper";

import { Schedule } from "../../../types/SchedulingTypes";

export interface SchedulingStepProps {
  navigation: NavigationProps;
  formValues: Schedule;
  setForm: SetForm;
  isBeingEdited?: boolean;
}
export interface DonationSizeInterface {
  image: string;
  size: string;
  description: string;
}
export interface SchedulingProgessBarProps {
  activeStep: number;
  totalSteps: number;
}

export enum DayPartsEnum {
  EARLY_MORNING = "Early Morning (12am - 6am)",
  MORNING = "Morning (6am - 11am)",
  AFTERNOON = "Afternoon (11am - 4pm)",
  EVENING = "Evening (4pm - 9pm)",
  NIGHT = "Night (9pm - 12am)",
}

export const dayParts = [
  DayPartsEnum.EARLY_MORNING,
  DayPartsEnum.MORNING,
  DayPartsEnum.AFTERNOON,
  DayPartsEnum.EVENING,
  DayPartsEnum.NIGHT,
];

export const timeRanges = {
  earlyMorning: [
    "12:00 AM - 1:00 AM",
    "1:00 AM - 2:00 AM",
    "2:00 AM - 3:00 AM",
    "3:00 AM - 4:00 AM",
    "4:00 AM - 5:00 AM",
    "5:00 AM - 6:00 AM",
  ],
  morning: [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM",
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
  ],
  afternoon: [
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ],
  evening: [
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
  ],
  night: ["9:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM"],
};

export const frequencies = ["One time", "Daily", "Weekly", "Monthly"];
