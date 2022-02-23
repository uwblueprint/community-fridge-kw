export const testCheckIns = [
    {
        volunteerId: null,
        startDate: new Date("2021-09-01T09:00:00.000Z"),
        endDate: new Date("2021-09-07T00:10:00.000Z"),
        notes: "volunteer null test",
    },
    {
        volunteerId: 3,
        startDate: new Date("2022-02-28T09:00:00.000Z"),
        endDate: new Date("2022-02-28T00:10:00.000Z"),
        notes: "test with volunteer 3",
    },
    {
        volunteerId: 4,
        startDate: new Date("2022-03-14T09:00:00.000Z"),
        endDate: new Date("2022-03-28T00:10:00.000Z"),
        notes: "test with volunteer 4",
        isAdmin: true,
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