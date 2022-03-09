const testCheckIns = [
  {
    startDate: new Date("2021-09-01T09:00:00.000Z"),
    endDate: new Date("2021-09-07T00:10:00.000Z"),
    notes: "volunteer null test",
  },
  {
    volunteerId: "1",
    startDate: new Date("2022-02-28T09:00:00.000Z"),
    endDate: new Date("2022-02-28T00:10:00.000Z"),
    notes: "test with volunteer 1",
  },
  {
    volunteerId: "1",
    startDate: new Date("2022-02-29T09:00:00.000Z"),
    endDate: new Date("2022-02-29T00:10:00.000Z"),
    notes: "test with volunteer 1 again",
  },
  {
    volunteerId: "2",
    startDate: new Date("2022-03-14T09:00:00.000Z"),
    endDate: new Date("2022-03-28T00:10:00.000Z"),
    notes: "test with volunteer 2",
    isAdmin: true,
  },
];

export default testCheckIns;
