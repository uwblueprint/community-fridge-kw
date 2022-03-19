import { Role, Status } from "../../../types/AuthTypes";

export type UserMgmtTableRecord = {
  userId: string;
  id: string;
  pointOfContact: string;
  company: string;
  email: string;
  phoneNumber: string;
  accountType: Role | string;
  approvalStatus: Status | string;
};
