export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User" | "Donor" | "Volunteer";
  accessToken: string;
  phoneNumber: string;
} | null;

export type AuthenticatedDonor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Donor";
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
