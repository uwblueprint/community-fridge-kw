export type Status = "Approved" | "Pending" | "Rejected";
export type Role = "User" | "Admin" | "Volunteer" | "Donor";

export type DonorRole = "LocalBusiness" | "IndividualDonor";

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

export type VolunteerDTO = {
  id: string;
  user_id: string;
};

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type SchedulingDTO = {
  id: number;
  donorId: number;
  category: string;
  quantity?: number;
  size?: number;
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
