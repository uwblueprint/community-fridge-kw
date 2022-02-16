export const RECURRING_DONATION_ID = "1";

export const testUsersDb = [
  {
    first_name: "Test",
    last_name: "User",
    auth_id: "test id",
    role: "Donor",
    email: "test@email.com",
  },
  {
    first_name: "Test",
    last_name: "User 2",
    auth_id: "test id 2",
    role: "Donor",
    email: "test2@email.com",
  },
  {
    first_name: "Test",
    last_name: "User 3",
    auth_id: "test id 3",
    role: "Volunteer",
    email: "test3@email.com",
  },
  {
    first_name: "Test",
    last_name: "User 4",
    auth_id: "test id 4",
    role: "Volunteer",
    email: "test4@email.com",
  },
];

export const testDonorsDb = [
  {
    user_id: 1,
    donor_type: "LocalBusiness",
    business_name: "Test Name 1",
  },
  {
    user_id: 2,
    donor_type: "IndividualDonor",
    business_name: "Test Name 2",
  },
];

export const testVolunteersDb = [
  {
    user_id: 3,
  },
  {
    user_id: 4,
  },
];

export const testSchedules = [
  {
    donorId: "1",
    categories: ["Dry packaged goods"],
    size: "medium",
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-09-01T09:00:00.000Z"),
    endTime: new Date("2021-09-01T00:10:00.000Z"),
    status: "Pending",
    volunteerNeeded: true,
    volunteerTime: "8:00 AM",
    frequency: "One time",
    notes: "these are the notes",
    volunteerId: "1",
  },
  {
    donorId: "2",
    categories: ["Non-perishables", "Tea and coffee"],
    size: "medium",
    isPickup: true,
    volunteerTime: "8:00 AM",
    pickupLocation: "location",
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-09-01T09:00:00.000Z"),
    endTime: new Date("2021-09-01T00:10:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Daily",
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2021-09-03T00:00:00.000Z"),
    notes: "these are the copied notes",
    volunteerId: "1",
  },
  {
    donorId: "1",
    categories: ["Fresh produce"],
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2022-03-01T00:08:00.000Z"),
    endTime: new Date("2022-03-01T00:06:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Monthly",
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2021-10-01T00:06:00.000Z"),
    notes: "these are the copied notes",
  },
  {
    donorId: "1",
    categories: ["Fresh produce"],
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2022-04-01T00:08:00.000Z"),
    endTime: new Date("2022-04-01T00:06:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Monthly",
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2021-10-01T00:06:00.000Z"),
    notes: "these are the copied notes",
  },
  {
    donorId: "1",
    categories: ["Fresh produce"],
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2022-05-01T00:08:00.000Z"),
    endTime: new Date("2022-05-01T00:06:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Monthly",
    recurringDonationId: RECURRING_DONATION_ID,
    recurringDonationEndDate: new Date("2021-10-01T00:06:00.000Z"),
    notes: "these are the copied notes",
  },
];
