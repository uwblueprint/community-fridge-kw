import colors from "../../../theme/colors";

export enum ShiftTypes {
  PICKUP = "Pickup assistance",
  UNLOADING = "Unloading assistance",
  CHECKIN = "Fridge check-in",
}

export const getShiftColor = (shift: string): string => {
  switch (shift) {
    case "Pickup assistance":
      return colors.turnip["50"];
    case "Unloading assistance":
      return colors.onion["50"];
    case "Fridge check-in":
      return colors.h20["50"];
    default:
      return "";
  }
};
