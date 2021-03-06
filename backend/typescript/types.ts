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

export enum DayPart {
  EARLY_MORNING = "Early Morning (12am - 6am)",
  MORNING = "Morning (6am - 11am)",
  AFTERNOON = "Afternoon (11am - 4pm)",
  EVENING = "Evening (4pm - 9pm)",
  NIGHT = "Night (9pm - 12am)",
}

export enum Frequency {
  ONE_TIME = "One time",
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
}

export const Categories = new Set([
  "Dry packaged goods",
  "Non-perishables",
  "Fresh produce",
  "Bread and baked goods",
  "Oil, spreads, and seasoning",
  "Tea and coffee",
  "Frozen meals",
  "Prepared meals",
  "Non-alcoholic drinks and juices",
  "Essential items (masks, hand sanitizer, bags)",
  "Hygiene products (tampons, pads, soap, etc.)",
]);

export const donationSizeDescriptions = new Map<string, string>([
  ["Small", "Fills less than a shelf of the fridge/pantry"],
  ["Medium", "Approximately fills one shelf of the fridge/pantry"],
  ["Large", "Approximately fills two shelves of the fridge/pantry"],
  [
    "Extra-large",
    "Approximately fills four shelves of the fridge/ pantry (full capacity)",
  ],
]);

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber: string;
};

export type DonorDTO = {
  id: string;
  userId: string;
  businessName: string;
  facebookLink?: string;
  instagramLink?: string;
};

export type VolunteerDTO = {
  id: string;
  userId: string;
  status: Status;
};

export type ContentDTO = {
  id: string;
  foodRescueDescription: string;
  foodRescueUrl: string;
  checkinDescription: string;
  checkinUrl: string;
};

export type UserDonorDTO = UserDTO & DonorDTO;

export type CreateDonorDTO = Omit<DonorDTO, "id">;

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type UserVolunteerDTO = UserDTO & VolunteerDTO;

export type UpdateVolunteerDTO = Omit<VolunteerDTO, "id" | "userId">;

export type CreateContentDTO = Omit<ContentDTO, "id">;

export type UpdateContentDTO = CreateContentDTO;

export type SchedulingDTO = {
  id: string;
  donorId: string;
  categories: string[];
  size?: string;
  isPickup: boolean;
  pickupLocation?: string | null;
  dayPart: DayPart;
  startTime: Date;
  endTime: Date;
  status: Status;
  frequency: Frequency;
  recurringDonationId?: string | null;
  recurringDonationEndDate?: Date | null;
  volunteerNeeded: boolean;
  volunteerTime?: string | null;
  notes?: string;
  volunteerId?: string | null;
};

export type CreateSchedulingDTO = Omit<SchedulingDTO, "id">;

export type UpdateSchedulingDTO = Partial<
  Omit<SchedulingDTO, "id" | "donorId">
>;

export type UpdateDonorDTO = Omit<DonorDTO, "id" | "userId">;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  };
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";

export type CheckInDTO = {
  id: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  volunteerId?: string | null;
  isAdmin?: boolean;
};

export type CreateCheckInDTO = Omit<CheckInDTO, "id">;

export type UpdateCheckInDTO = Partial<Omit<CheckInDTO, "id">>;

export enum ShiftType {
  CHECKIN = "checkIn",
  SCHEDULING = "scheduling",
}

export type SchedulingDTOWithShiftType = SchedulingDTO & {
  type: ShiftType.SCHEDULING;
};
export type CheckInDTOWithShiftType = CheckInDTO & { type: ShiftType.CHECKIN };

export type DTOTypes = Record<
  string,
  Date | string | string[] | boolean | number | null | undefined
>;
