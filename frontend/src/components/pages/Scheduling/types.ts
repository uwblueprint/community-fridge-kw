import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  id: string;
  donorId: string;
  categories: string[];
  size: string;
  isPickup: boolean;
  pickupLocation: string;
  daypart: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean;
  frequency: string;
  notes: string;
}

export interface SchedulingStepProps {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
  setForm: SetForm;
}

export interface TypesOfItemsInterface {
  title: string;
  list: string[];
}

export interface DonationSizeInterface {
  image: any;
  size: string;
  description: string;
  selected?: boolean;
}
export interface SchedulingProgessBarProps {
  activeStep: number;
  totalSteps: number;
}
