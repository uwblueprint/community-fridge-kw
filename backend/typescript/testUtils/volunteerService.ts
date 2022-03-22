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

export const expectedCheckInsAndSchedules = [
  {
    id: '2',
    donorId: '2',
    categories: [ 'Non-perishables', 'Tea and coffee' ],
    size: 'medium',
    isPickup: true,
    pickupLocation: 'location',
    dayPart: 'Morning (6am - 11am)',
    startTime: new Date("2022-09-08T09:00:00.000Z"),
    endTime: new Date("2022-09-08T10:00:00.000Z"),
    status: 'Pending',
    volunteerNeeded: true,
    volunteerTime: '8:00 AM',
    frequency: 'Daily',
    recurringDonationId: '1',
    recurringDonationEndDate: new Date("2022-09-10T00:00:00.000Z"),
    notes: 'these are the copied notes',
    volunteerId: '1',
    type: 'scheduling'
  },
  {
    id: '2',
    startDate: new Date("2022-09-05T09:00:00.000Z"),
    endDate: new Date("2022-09-05T10:00:00.000Z"),
    notes: 'test with volunteer 1',
    volunteerId: '1',
    isAdmin: false,
    type: 'checkIn'
  },
  {
    id: "3",
    startDate: new Date("2022-03-01T09:00:00.000Z"),
    endDate: new Date("2022-03-01T10:00:00.000Z"),
    notes: "test with volunteer 1 again",
    volunteerId: '1',
    isAdmin: false,
    type: 'checkIn'
  },
  {
    id: '1',
    donorId: '1',
    categories: [ 'Dry packaged goods' ],
    size: 'medium',
    isPickup: false,
    pickupLocation: null,
    dayPart: 'Morning (6am - 11am)',
    startTime: new Date("2021-09-01T09:00:00.000Z"),
    endTime: new Date("2021-09-01T10:00:00.000Z"),
    status: 'Pending',
    volunteerNeeded: true,
    volunteerTime: '8:00 AM',
    frequency: 'One time',
    recurringDonationId: 'null',
    recurringDonationEndDate: null,
    notes: 'these are the notes',
    volunteerId: '1',
    type: 'scheduling'
  },
]
