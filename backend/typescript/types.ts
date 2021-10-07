export type Role = "User" | "Admin";
export type Status = "Approved" | "Pending" | "Rejected";

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
};

export type DonorDTO = {
  donorId: number;
  donorType: DonorRole;
  facebookLink?: string;
  instagramLink?: string;
  recurringDonor?: boolean;
  businessName?: string;
}

export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

export type UpdateUserDTO = Omit<UserDTO, "id">;

export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

export type AuthDTO = Token & UserDTO;

export type CreateDonorDTO = Omit<DonorDTO, "id">; // fix this

export type UpdateDonorDTO = Omit<DonorDTO, "id">;

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
