export enum Status {
  APPROVED = "Approved",
  PENDING = "Pending",
  REJECTED = "Rejected",
}
export type Role = "User" | "Admin" | "Volunteer" | "Donor";

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
  businessName?: string;
  facebookLink?: string;
  instagramLink?: string;
};

export type VolunteerDTO = {
  id: string;
  userId: string;
};

export type UserDonorDTO = UserDTO & DonorDTO;

export type CreateDonorDTO = Omit<DonorDTO, "id">;

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type SchedulingDTO = {
  id: string;
  donorId: string;
  category: string;
  quantity?: number;
  size?: string;
  pickupLocation?: string;
  startTime: Date;
  endTime: Date;
  status: Status;
  volunteersNeeded: number;
  volunteerIds: number[];
  notes?: string;
};

export type CreateSchedulingDTO = Omit<SchedulingDTO, "id" | "volunteerIds">;

export type UpdateSchedulingDTO = Partial<
  Omit<SchedulingDTO, "id" | "donorId">
>;

export type UpdateDonorDTO = Omit<DonorDTO, "id" | "userId">;

export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";
