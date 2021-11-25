export enum Role {
  USER = "User",
  ADMIN = "Admin",
  VOLUNTEER = "Volunteer",
  DONOR = "Donor",
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

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
