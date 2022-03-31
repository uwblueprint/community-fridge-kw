import colors from "../../../theme/colors";

export enum ShiftType {
  CHECKIN = "checkIn",
  SCHEDULING = "scheduling",
}

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
