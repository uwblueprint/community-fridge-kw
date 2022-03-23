import { SetStateAction } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";

import { Schedule } from "../../../types/SchedulingTypes";

export interface ShiftStepProps {
  navigation: NavigationProps;
  setShiftId?: any;
  setIsRescue: any;
  isRescue?: boolean;
}
