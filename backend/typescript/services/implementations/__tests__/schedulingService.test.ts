import { snakeCase } from "lodash";
import Scheduling from "../../../models/scheduling.model";
import {
  SchedulingDTO,
  Status,
  CreateSchedulingDTO,
  DayPart,
  Frequency,
} from "../../../types";
import User from "../../../models/user.model";
import Donor from "../../../models/donor.model";
import SchedulingService from "../schedulingService";

import testSql from "../../../testUtils/testDb";

type SchedulingKey = keyof typeof Scheduling;

const testUsersDb = [
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
];

const testDonorsDb = [
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

const testSchedules = [
  {
    donorId: "1",
    categories: ["Dry packaged goods"],
    size: "medium",
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-09-30T00:00:00.000Z"),
    endTime: new Date("2021-10-01T00:00:00.000Z"),
    status: "Pending",
    volunteerNeeded: true,
    volunteerTime: "8:00 AM",
    frequency: "One time donation",
    notes: "these are the notes",
  },
  {
    donorId: "2",
    categories: ["Non-perishables", "Tea and coffee"],
    size: "medium",
    isPickup: true,
    volunteerTime: "8:00 AM",
    pickupLocation: "location",
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-09-30T00:00:00.000Z"),
    endTime: new Date("2021-10-01T00:00:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Weekly",
    recurringDonationId: "1",
    recurringDonationEndDate: new Date("2022-11-01T00:00:00.000Z"),
    notes: "these are the copied notes",
  },
  {
    donorId: "1",
    categories: ["Fresh produce"],
    isPickup: false,
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-03-01T00:08:00.000Z"),
    endTime: new Date("2021-03-01T00:06:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Monthly",
    recurringDonationId: "2",
    recurringDonationEndDate: new Date("2021-10-01T00:06:00.000Z"),
    notes: "these are the copied notes",
  },
];

const invalidTestSchedule = [
  {
    donorId: "2",
    categories: ["Non-perishables"],
    size: "medium",
    isPickup: true,
    pickupLocation: "copied location",
    dayPart: "Morning (6am - 11am)",
    startTime: new Date("2021-10-30T00:50:00.000Z"),
    endTime: new Date("2021-10-30T00:00:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Weekly",
    notes: "these are the copied notes",
  },
];

describe("pg schedulingService", () => {
  let schedulingService: SchedulingService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    schedulingService = new SchedulingService();
    await User.bulkCreate(testUsersDb);
    await Donor.bulkCreate(testDonorsDb);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  test("getSchedules", async () => {
    const schedules = testSchedules.map((schedule) => {
      const scheduleSnakeCase: Record<
        string,
        string | string[] | boolean | number | Date | undefined
      > = {};
      Object.entries(schedule).forEach(([key, value]) => {
        scheduleSnakeCase[snakeCase(key)] = value;
      });
      return scheduleSnakeCase;
    });

    await Scheduling.bulkCreate(schedules);

    const res = await schedulingService.getSchedulings();
    expect(res).toMatchObject(testSchedules);
  });

  test("getSchedulesByDonorId", async () => {
    const schedules = testSchedules.map((schedule) => {
      const scheduleSnakeCase: Record<
        string,
        string | string[] | boolean | number | Date | undefined
      > = {};
      Object.entries(schedule).forEach(([key, value]) => {
        scheduleSnakeCase[snakeCase(key)] = value;
      });
      return scheduleSnakeCase;
    });

    await Scheduling.bulkCreate(schedules);
    const { donorId } = testSchedules[0];
    const res = await schedulingService.getSchedulingsByDonorId(
      donorId.toString(),
    );
    expect(res).toMatchObject(
      testSchedules.filter((schedule) => schedule.donorId === donorId),
    );
  });

  test("getScheduleById", async () => {
    const schedules = testSchedules.map((schedule) => {
      const scheduleSnakeCase: Record<
        string,
        string | string[] | boolean | number | Date | undefined
      > = {};
      Object.entries(schedule).forEach(([key, value]) => {
        scheduleSnakeCase[snakeCase(key)] = value;
      });
      return scheduleSnakeCase;
    });

    await Scheduling.bulkCreate(schedules);
    const res = await schedulingService.getSchedulingById("1");
    expect(res).toMatchObject(testSchedules[0]);
  });

  test("createScheduling", async () => {
    const startTime: Date = new Date("October 13, 2014 11:13:00");
    const endTime: Date = new Date("October 13, 2014 11:13:00");
    const status: Status = Status.APPROVED;
    const dayPart = DayPart.AFTERNOON;
    const frequency = Frequency.MONTHLY;
    const schedulingToCreate: CreateSchedulingDTO = {
      ...testSchedules[0],
      status,
      frequency,
      dayPart,
      startTime,
      endTime,
    };

    const res = await schedulingService.createScheduling(schedulingToCreate);

    const schedulingDbRes: SchedulingDTO | null =
      await schedulingService.getSchedulingById("1");
    if (schedulingDbRes) {
      const keys = Object.keys(schedulingToCreate);
      keys.forEach((key) => {
        expect(schedulingDbRes[key as keyof SchedulingDTO]).toEqual(
          schedulingToCreate[key as keyof CreateSchedulingDTO],
        );
      });
    }
  });

  test("updateScheduling", async () => {
    const schedules = testSchedules.map((schedule) => {
      const scheduleSnakeCase: Record<
        string,
        string | string[] | boolean | number | Date | undefined
      > = {};
      Object.entries(schedule).forEach(([key, value]) => {
        scheduleSnakeCase[snakeCase(key)] = value;
      });
      return scheduleSnakeCase;
    });

    await Scheduling.bulkCreate(schedules);

    // Updating one of each type of field
    const newCategories = ["Tea and coffee"];
    const newVolunteerNeeded = !testSchedules[1].volunteerNeeded;
    const newStartTime: Date = new Date("October 13, 2022 12:00:00");

    const resString = await schedulingService.updateSchedulingById("1", {
      categories: newCategories,
    });
    const resNum = await schedulingService.updateSchedulingById("2", {
      volunteerNeeded: newVolunteerNeeded,
    });
    const resDate = await schedulingService.updateSchedulingById("3", {
      startTime: newStartTime,
    });

    expect(resString.categories).toStrictEqual(newCategories);
    expect(resNum.volunteerNeeded).toBe(newVolunteerNeeded);
    expect(resDate.startTime).toEqual(newStartTime);
  });

  test("deleteScheduling", async () => {
    const schedules = testSchedules.map((schedule) => {
      const scheduleSnakeCase: Record<
        string,
        string | string[] | boolean | number | Date | undefined
      > = {};
      Object.entries(schedule).forEach(([key, value]) => {
        scheduleSnakeCase[snakeCase(key)] = value;
      });
      return scheduleSnakeCase;
    });

    await Scheduling.bulkCreate(schedules);

    const schedulingToDelete: Scheduling | null = await Scheduling.findOne();
    expect(schedulingToDelete).not.toBeNull();
    if (schedulingToDelete) {
      const res = await schedulingService.deleteSchedulingById(
        schedulingToDelete.id.toString(),
      );
      const schedulingsDbAfterDelete: Scheduling[] = await Scheduling.findAll();
      schedulingsDbAfterDelete.forEach((scheduling: Scheduling, i) => {
        expect(scheduling.id).not.toBe(schedulingToDelete.id);
      });
      expect(schedulingsDbAfterDelete.length).toBe(testSchedules.length - 1);
    }
  });
});
