export type DonorResponse = {
  id: string;
  businessName: string;
  email: string;
  facebookLink?: string;
  firstName: string;
  instagramLink?: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  userId: string;
};

export type UpdateDonorDataType = {
  businessName?: string;
  facebookLink?: string;
  instagramLink?: string;
};
