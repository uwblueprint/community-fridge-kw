export const testCheckIns = [
  {
    startDate: new Date("2021-09-01T09:00:00.000Z"),
    endDate: new Date("2021-09-07T10:00:00.000Z"),
    notes: "volunteer null test",
  },
  {
    volunteerId: "1",
    startDate: new Date("2022-02-28T09:00:00.000Z"),
    endDate: new Date("2022-02-28T10:00:00.000Z"),
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

export const testUpdatedCheckIns = [
  {
    volunteerId: "1",
    startDate: new Date("2021-09-01T09:00:00.000Z"),
    endDate: new Date("2021-09-07T10:00:00.000Z"),
    notes: "updated notes",
  },
];

export const testContent = [
  {
    food_rescue_description: "test food rescue description",
    food_rescue_url: "https://www.google.com",
    checkin_description: "test checkin description",
    checkin_url: "https://www.google.com",
  },
];

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

export const testVolunteersDb = [
  {
    user_id: 3,
  },
  {
    user_id: 4,
  },
];
