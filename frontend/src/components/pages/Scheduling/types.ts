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
