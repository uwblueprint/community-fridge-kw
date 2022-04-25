import {
  CreateSchedulingDTO,
  DayPart,
  Status,
  Frequency,
  Role,
} from "../types";
import { RECURRING_DONATION_ID } from "./schedulingService";

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

export const testCheckIns = [
  {
    startDate: new Date("2021-09-01T09:00:00.000Z"),
    endDate: new Date("2021-09-07T10:00:00.000Z"),
    notes: "volunteer null test",
  },
  {
    volunteerId: "1",
    startDate: new Date("2022-09-05T09:00:00.000Z"),
    endDate: new Date("2022-09-05T10:00:00.000Z"),
    notes: "test with volunteer 1",
  },
  {
    volunteerId: "1",
    startDate: new Date("2022-02-29T09:00:00.000Z"),
    endDate: new Date("2022-02-29T10:00:00.000Z"),
    notes: "test with volunteer 1 again",
  },
  {
    volunteerId: "2",
    startDate: new Date("2022-03-14T09:00:00.000Z"),
    endDate: new Date("2022-03-28T10:00:00.000Z"),
    notes: "test with volunteer 2",
    isAdmin: true,
  },
];

export const testSchedules: CreateSchedulingDTO[] = [
  {
    donorId: "1",
    categories: ["Dry packaged goods"],
    size: "medium",
    isPickup: false,
    dayPart: DayPart.MORNING,
    startTime: new Date("2022-09-01T09:00:00.000Z"),
    endTime: new Date("2022-09-01T10:00:00.000Z"),
    status: Status.PENDING,
    volunteerNeeded: true,
    volunteerTime: "16:00",
    frequency: Frequency.ONE_TIME,
    notes: "these are the notes",
    volunteerId: "1",
  },
  {
    donorId: "2",
    categories: ["Non-perishables", "Tea and coffee"],
    size: "medium",
    isPickup: true,
    volunteerTime: "15:59",
    pickupLocation: "location",
    dayPart: DayPart.MORNING,
    startTime: new Date("2022-09-01T09:00:00.000Z"),
    endTime: new Date("2022-09-01T10:00:00.000Z"),
    status: Status.PENDING,
    volunteerNeeded: true,
    frequency: Frequency.DAILY,
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2022-09-10T00:00:00.000Z"),
    notes: "these are the copied notes",
    volunteerId: "1",
  },
  {
    donorId: "1",
    categories: ["Fresh produce"],
    size: "Large",
    isPickup: false,
    dayPart: DayPart.MORNING,
    startTime: new Date("2022-03-01T08:00:00.000Z"),
    endTime: new Date("2022-03-01T09:00:00.000Z"),
    status: Status.PENDING,
    volunteerNeeded: false,
    frequency: Frequency.WEEKLY,
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2022-03-20T00:06:00.000Z"),
    notes: "these are the copied notes",
  },
];

export const expectedCheckInsAndSchedules = [
  {
    id: "3",
    startDate: new Date("2022-02-29T09:00:00.000Z"),
    endDate: new Date("2022-02-29T10:00:00.000Z"),
    notes: "test with volunteer 1 again",
    volunteerId: "1",
    isAdmin: false,
    type: "checkIn",
  },
  {
    id: "2",
    donorId: "2",
    categories: ["Non-perishables", "Tea and coffee"],
    size: "medium",
    isPickup: true,
    volunteerTime: "15:59",
    pickupLocation: "location",
    dayPart: DayPart.MORNING,
    startTime: new Date("2022-09-01T09:00:00.000Z"),
    endTime: new Date("2022-09-01T10:00:00.000Z"),
    status: Status.PENDING,
    volunteerNeeded: true,
    frequency: Frequency.DAILY,
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2022-09-10T00:00:00.000Z"),
    notes: "these are the copied notes",
    volunteerId: "1",
    type: "scheduling",
  },
  {
    id: "1",
    donorId: "1",
    categories: ["Dry packaged goods"],
    size: "medium",
    isPickup: false,
    dayPart: DayPart.MORNING,
    startTime: new Date("2022-09-01T09:00:00.000Z"),
    endTime: new Date("2022-09-01T10:00:00.000Z"),
    status: Status.PENDING,
    volunteerNeeded: true,
    volunteerTime: "16:00",
    frequency: Frequency.ONE_TIME,
    notes: "these are the notes",
    volunteerId: "1",
    type: "scheduling",
  },
  {
    id: "2",
    startDate: new Date("2022-09-05T09:00:00.000Z"),
    endDate: new Date("2022-09-05T10:00:00.000Z"),
    notes: "test with volunteer 1",
    volunteerId: "1",
    isAdmin: false,
    type: "checkIn",
  },
];
