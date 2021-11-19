import { NavigationProps, SetForm } from "react-hooks-helper";

export interface SchedulingFormProps {
  id: string;
  donorId: string;
  categories: string[];
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
  isBeingEdited?: boolean;
}

export interface SchedulingProgessBarProps {
  activeStep: number;
  totalSteps: number;
}
