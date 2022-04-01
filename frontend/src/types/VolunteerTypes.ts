import { Role, Status } from "./AuthTypes";

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

export type VolunteerDTO = {
  id: string;
  userId: string;
  status: Status;
};
