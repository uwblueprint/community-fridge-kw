import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  categories: string;
  size: string;
  isPickup: boolean;
  pickupLocation: string;
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
