import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  id: string;
  donorId: string;
  categories: string[];
  size: string;
  isPickup: boolean | null;
  pickupLocation: string;
  dayPart: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean | null;
  volunteerTime: string;
  frequency: string;
  recurringDonationEndDate: string;
  notes: string;
}

export interface SchedulingStepProps {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
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
