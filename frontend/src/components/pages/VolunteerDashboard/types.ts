import colors from "../../../theme/colors";
import { ShiftType } from "../../../types/VolunteerTypes";

export const getShiftColor = (shift: string, isPickup: boolean): string => {
  switch (shift) {
    case ShiftType.SCHEDULING:
      return isPickup ? colors.turnip["50"] : colors.onion["50"];
    case ShiftType.CHECKIN:
      return colors.h20["50"];
    default:
      return "";
  }
};

export default getShiftColor;
