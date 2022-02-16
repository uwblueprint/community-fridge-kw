export enum Role {
  USER = "User",
  ADMIN = "Admin",
  VOLUNTEER = "Volunteer",
  DONOR = "Donor",
}

export enum Status {
  APPROVED = "Approved",
  PENDING = "Pending",
  REJECTED = "Rejected",
}

export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  accessToken: string;
  phoneNumber: string;
} | null;

export type AuthenticatedDonor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role.DONOR;
  phoneNumber: string;
  accessToken: string;
  businessName: string;
  facebookLink?: string;
  instagramLink?: string;
} | null;

export type AuthenticatedVolunteer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role.VOLUNTEER;
  accessToken: string;
  phoneNumber: string;
  status: Status;
} | null;

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
