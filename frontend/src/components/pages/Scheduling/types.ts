import { NavigationProps, SetForm } from "react-hooks-helper";

import xl from "../../../assets/donation-sizes/lg.png";
import lg from "../../../assets/donation-sizes/md.png";
import md from "../../../assets/donation-sizes/sm.png";
import sm from "../../../assets/donation-sizes/xs.png";
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

export interface BackButtonProps {
  isBeingEdited?: boolean;
  onSaveClick: () => void;
  previous?: () => void;
  children?: React.ReactNode;
}

export interface NextButtonProps {
  isBeingEdited?: boolean;
  go?: (step: string | number) => void;
  canSubmit: boolean;
  handleNext: () => void;
  children?: React.ReactNode;
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

export enum DonationFrequency {
  ONE_TIME = "One time",
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
}

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

export const DonationSizes: DonationSizeInterface[] = [
  {
    image: sm,
    size: "Small",
    description: "Fills less than a shelf of the fridge/pantry",
  },
  {
    image: md,
    size: "Medium",
    description: "Approximately fills one shelf of the fridge/pantry",
  },
  {
    image: lg,
    size: "Large",
    description: "Approximately fills two shelves of the fridge/pantry",
  },
  {
    image: xl,
    size: "Extra-large",
    description:
      "Approximately fills four shelves of the fridge/ pantry (full capacity)",
  },
];

export const categoriesOptions = [
  "Dry packaged goods",
  "Non-perishables",
  "Fresh produce",
  "Bread and baked goods",
  "Oil, spreads, and seasoning",
  "Tea and coffee",
  "Frozen meals",
  "Prepared meals",
  "Non-alcoholic drinks and juices",
  "Essential items (masks, hand sanitizer, bags)",
  "Hygiene products (tampons, pads, soap, etc.)",
];

export const frequencies = ["One time", "Daily", "Weekly", "Monthly"];
