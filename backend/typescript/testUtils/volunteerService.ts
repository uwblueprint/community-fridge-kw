import { Role, Status } from "../types";

export const testUsers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
];

export const testVolunteers = [
  {
    userId: "1",
    status: Status.PENDING,
  },
  {
    userId: "2",
    status: Status.PENDING,
  },
];

export const testUserVolunteers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "1",
    status: Status.PENDING,
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "2",
    status: Status.PENDING,
  },
];

export const testUpdatedUserVolunteers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "1",
    status: Status.APPROVED,
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "2",
    status: Status.REJECTED,
  },
];
