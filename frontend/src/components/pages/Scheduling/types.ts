import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  categories: string;
  size: string;
  pickupLocation: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean;
  notes: string;
}

export interface SchedulingStepProps {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
  setForm: SetForm;
}
