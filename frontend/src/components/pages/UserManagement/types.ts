import { Role, Status } from "../../../types/AuthTypes";

export type UserMgmtTableRecord = {
  userId: string;
  id: string;
  firstName: string;
  pointOfContact: string;
  company: string;
  email: string;
  phoneNumber: string;
  accountType: Role | string;
  approvalStatus: Status | string;
};

export enum AccountFilterType {
  ALL = "all",
  VOLUNTEER = "volunteers",
  DONOR = "donors",
}

export const accountTypefilterOptions = [
  {
    value: AccountFilterType.ALL,
    label: "All accounts",
  },
  {
    value: AccountFilterType.VOLUNTEER,
    label: "Volunteers",
  },
  {
    value: AccountFilterType.DONOR,
    label: "Donors",
  },
];
