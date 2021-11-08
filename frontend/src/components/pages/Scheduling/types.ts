import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  category: string;
  quantity: number;
  size: string;
  pickupLocation: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteersNeeded: number;
  notes: string;
}

export interface SchedulingStepProps {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
  setForm: SetForm;
}
