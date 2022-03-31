import { Role, Status } from "./AuthTypes";
import { CheckIn } from "./CheckInTypes";
import { Schedule } from "./SchedulingTypes";

export type VolunteerResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role.VOLUNTEER;
  userId: string;
  phoneNumber: string;
  status: Status;
};

export type AuthenticatedVolunteer = VolunteerResponse | null;

export type UpdateVolunteerDataType = {
  status: Status;
};

export type VolunteerContextType = {
  volunteerId: string | null;
  volunteerStatus: Status;
};

export type AuthenticatedVolunteerContext = VolunteerContextType | null;

export type VolunteerContextAction =
  | {
      type: "SET_VOLUNTEER_ID";
      value: string;
    }
  | {
      type: "SET_VOLUNTEER_STATUS";
      value: Status;
    };

export enum ShiftType {
  CHECKIN = "checkIn",
  SCHEDULING = "scheduling",
}

export type ScheduleWithShiftType = Schedule & {
  type: ShiftType.SCHEDULING;
};
export type CheckInWithShiftType = CheckIn & { type: ShiftType.CHECKIN };
