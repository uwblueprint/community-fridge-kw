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
