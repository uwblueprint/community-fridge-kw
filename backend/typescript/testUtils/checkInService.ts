export const testCheckIns = [
  {
    volunteer_id: null,
    start_date: new Date("2021-09-01T09:00:00.000Z"),
    end_date: new Date("2021-09-07T00:10:00.000Z"),
    notes: "volunteer null test",
  },
  {
    volunteer_id: 1,
    start_date: new Date("2022-02-28T09:00:00.000Z"),
    end_date: new Date("2022-02-28T00:10:00.000Z"),
    notes: "test with volunteer 3",
  },
  {
    volunteer_id: 2,
    start_date: new Date("2022-03-14T09:00:00.000Z"),
    end_date: new Date("2022-03-28T00:10:00.000Z"),
    notes: "test with volunteer 4",
    isAdmin: true,
  },
];

export const testUpdatedCheckIns = [
  {
    volunteerId: "1",
    startDate: new Date("2021-09-01T09:00:00.000Z"),
    endDate: new Date("2021-09-07T00:10:00.000Z"),
    notes: "updated notes",
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
