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
import schedulingRouter from "../../../rest/schedulingRoutes";

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
    startTime: new Date("2021-09-01T09:00:00.000Z"),
    endTime: new Date("2021-09-01T00:10:00.000Z"),
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
    startTime: new Date("2021-09-01T09:00:00.000Z"),
    endTime: new Date("2021-09-01T00:10:00.000Z"),
    status: "Pending",
    volunteerNeeded: false,
    frequency: "Daily",
    recurringDonationEndDate: new Date("2021-09-03T00:00:00.000Z"),
    notes: "these are the copied notes",
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
      0,
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
    const frequency = Frequency.ONE_TIME;
    const schedulingToCreate: CreateSchedulingDTO = {
      ...testSchedules[0],
      status,
      frequency,
      dayPart,
      startTime,
      endTime,
    };

    const res = await schedulingService.createScheduling(schedulingToCreate);

    const schedulingDbRes: SchedulingDTO | null = await schedulingService.getSchedulingById(
      "1",
    );
    if (schedulingDbRes) {
      const keys = Object.keys(schedulingToCreate);
      keys.forEach((key) => {
        expect(schedulingDbRes[key as keyof SchedulingDTO]).toEqual(
          schedulingToCreate[key as keyof CreateSchedulingDTO],
        );
      });
    }
  });

  test("create recurring donation schedules", async () => {
    const startTime: Date = new Date("September 1, 2021 11:00:00");
    const endTime: Date = new Date("September 1, 2021 12:00:00");
    const status: Status = Status.APPROVED;
    const dayPart = DayPart.AFTERNOON;
    const frequency = Frequency.DAILY;

    const oneTimeDonationScheduleToCreate: CreateSchedulingDTO = {
      ...testSchedules[0],
      status,
      frequency: Frequency.ONE_TIME,
      dayPart,
      startTime,
      endTime,
    };

    // CREATE ONE-TIME DONATION
    const resOneTime = await schedulingService.createScheduling(
      oneTimeDonationScheduleToCreate,
    );

    const dailySchedulingToCreate: CreateSchedulingDTO = {
      ...testSchedules[1],
      status,
      frequency,
      dayPart,
      startTime,
      endTime,
    };
    const currStartDate: Date = new Date(startTime);
    const currEndDate: Date = new Date(endTime);

    // CREATE DAILY DONATION
    const resDaily = await schedulingService.createScheduling(
      dailySchedulingToCreate,
    );
    const dailySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    // filter out one-time donation schedule
    const dailySchedules: SchedulingDTO[] = dailySchedulingDbRes.filter(
      (item) => {
        return Number(item.recurringDonationId) === 1;
      },
    );
    // calculate expected number of schedules associated with this daily donation
    startTime.setHours(0, 0, 0, 0);
    const dailySchedulingObjectsNum: number =
      (dailySchedulingToCreate.recurringDonationEndDate!.getTime() -
        startTime.getTime()) /
        (1000 * 60 * 60 * 24) +
      1;

    expect(dailySchedules.length).toEqual(dailySchedulingObjectsNum);

    const dailyDonationGroupId = 1;
    for (let i = 0; i < dailySchedules.length; i += 1) {
      const tempStartDate: Date = new Date(currStartDate);
      const tempEndDate: Date = new Date(currEndDate);
      // check that start and end dates are correct
      tempStartDate.setDate(currStartDate.getDate() + i);
      tempEndDate.setDate(currEndDate.getDate() + i);
      expect(dailySchedules[i].startTime).toEqual(tempStartDate);
      expect(dailySchedules[i].endTime).toEqual(tempEndDate);
      // verify recurring donation id is the same for all schedule objects
      expect(Number(dailySchedules[i].recurringDonationId)).toEqual(
        dailyDonationGroupId,
      );
    }

    // CREATE WEEKLY DONATION
    const weeklySchedulingToCreate: CreateSchedulingDTO = {
      ...dailySchedulingToCreate,
      frequency: Frequency.WEEKLY,
      recurringDonationEndDate: new Date("2021-09-29T00:00:00.000Z"),
      startTime: new Date("September 1, 2021 11:00:00"),
      endTime: new Date("September 1, 2021 12:00:00"),
    };

    const resWeekly = await schedulingService.createScheduling(
      weeklySchedulingToCreate,
    );
    const weeklySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    // filter for only schedules associated with this weekly donation
    const weeklySchedules: SchedulingDTO[] = weeklySchedulingDbRes.filter(
      (item) => {
        return Number(item.recurringDonationId) === 2;
      },
    );
    // calculate expected number of schedules associated with this weekly donation
    const weeklySchedulingObjectsNum: number =
      Math.floor(
        (weeklySchedulingToCreate.recurringDonationEndDate!.getTime() -
          startTime.getTime()) /
          (7 * 1000 * 60 * 60 * 24),
      ) + 1;

    expect(weeklySchedules.length).toEqual(weeklySchedulingObjectsNum);

    const weeklyDonationGroupId = 2;
    for (let i = 0; i < weeklySchedules.length; i += 1) {
      const tempStartDate: Date = new Date(currStartDate);
      const tempEndDate: Date = new Date(currEndDate);
      // check that start and end dates are correct
      tempStartDate.setDate(currStartDate.getDate() + i * 7);
      tempEndDate.setDate(currEndDate.getDate() + i * 7);
      expect(weeklySchedules[i].startTime).toEqual(tempStartDate);
      expect(weeklySchedules[i].endTime).toEqual(tempEndDate);
      // verify recurring donation id is the same for all scheduling objects
      expect(Number(weeklySchedules[i].recurringDonationId)).toEqual(
        weeklyDonationGroupId,
      );
    }

    // CREATE MONTHLY DONATION
    const monthlySchedulingToCreate: CreateSchedulingDTO = {
      ...dailySchedulingToCreate,
      frequency: Frequency.MONTHLY,
      recurringDonationEndDate: new Date("2021-02-28T00:00:00.000Z"),
      startTime: new Date("September 1, 2021 11:00:00"),
      endTime: new Date("September 1, 2021 12:00:00"),
    };

    const resMonthly = await schedulingService.createScheduling(
      monthlySchedulingToCreate,
    );
    const resMonthlySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    // filter for only scheduling objects associated with this monthly donation
    const monthlySchedules: SchedulingDTO[] = resMonthlySchedulingDbRes.filter(
      (item) => {
        return Number(item.recurringDonationId) === 3;
      },
    );
    // calculate expected number of donations associated with this monthly donation
    let monthlySchedulingObjectsNum = 0;
    const dateIncrementor: Date = new Date(currStartDate);
    dateIncrementor.setHours(0, 0, 0, 0);
    while (
      dateIncrementor.valueOf() <=
      weeklySchedulingToCreate.recurringDonationEndDate!.valueOf()
    ) {
      monthlySchedulingObjectsNum += 1;
      dateIncrementor.setMonth(dateIncrementor.getMonth() + 1);
    }

    expect(monthlySchedules.length).toEqual(monthlySchedulingObjectsNum);

    const monthlyDonationGroupId = 3;
    for (let i = 0; i < monthlySchedules.length; i += 1) {
      const tempStartDate: Date = new Date(currStartDate);
      const tempEndDate: Date = new Date(currEndDate);
      // check that start and end dates are correct
      tempStartDate.setMonth(currStartDate.getMonth() + i);
      tempEndDate.setMonth(currEndDate.getMonth() + i);
      expect(monthlySchedules[i].startTime).toEqual(tempStartDate);
      expect(monthlySchedules[i].endTime).toEqual(tempEndDate);
      // verify recurring donation id is the same for all scheduling objects
      expect(Number(monthlySchedules[i].recurringDonationId)).toEqual(
        monthlyDonationGroupId,
      );
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
