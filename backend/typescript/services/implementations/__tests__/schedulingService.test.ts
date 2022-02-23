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
import {
  RECURRING_DONATION_ID,
  testUsersDb,
  testDonorsDb,
  testSchedules,
} from "../../../testUtils/schedulingService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import IDonorService from "../../interfaces/donorService";
import DonorService from "../donorService";

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

jest.mock("nodemailer", () => {
  const createTransport = jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  });
  return { createTransport };
});

describe("pg schedulingService", () => {
  let schedulingService: SchedulingService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    const emailService: IEmailService = new EmailService(nodemailerConfig);
    const donorService: IDonorService = new DonorService();
    schedulingService = new SchedulingService(emailService, donorService);
    await User.bulkCreate(testUsersDb);
    await Donor.bulkCreate(testDonorsDb);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  test("getSchedules", async () => {
    await Scheduling.bulkCreate(schedules);

    const res = await schedulingService.getSchedulings();

    expect(res).toMatchObject(testSchedules);
  });

  test("getSchedulesByDonorId", async () => {
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
      recurringDonationEndDate: new Date("2022-01-12T00:00:00.000Z"),
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
    const monthlySchedulingObjectsNum =
      Math.floor(
        (monthlySchedulingToCreate.recurringDonationEndDate!.getTime() -
          startTime.getTime()) /
          (28 * 1000 * 60 * 60 * 24),
      ) + 1;

    expect(monthlySchedules.length).toEqual(monthlySchedulingObjectsNum);

    const monthlyDonationGroupId = 3;
    for (let i = 0; i < monthlySchedules.length; i += 1) {
      const tempStartDate: Date = new Date(currStartDate);
      const tempEndDate: Date = new Date(currEndDate);
      // check that start and end dates are correct
      tempStartDate.setDate(currStartDate.getDate() + i * 28);
      tempEndDate.setDate(currStartDate.getDate() + i * 28);
      expect(monthlySchedules[i].startTime).toEqual(tempStartDate);
      expect(monthlySchedules[i].endTime).toEqual(tempEndDate);
      // verify recurring donation id is the same for all scheduling objects
      expect(Number(monthlySchedules[i].recurringDonationId)).toEqual(
        monthlyDonationGroupId,
      );
    }
  });

  test("updateScheduling", async () => {
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

  test("deleteRecurringScheduling", async () => {
    await Scheduling.bulkCreate(schedules);

    const recurringIdCount = schedules.filter(
      (schedule) => schedule.recurring_donation_id === RECURRING_DONATION_ID,
    ).length;

    const res = await schedulingService.deleteSchedulingByRecurringDonationId(
      RECURRING_DONATION_ID,
      testSchedules[1].startTime.toISOString(),
    );
    const schedulingsDbAfterDelete: Scheduling[] = await Scheduling.findAll();
    schedulingsDbAfterDelete.forEach((scheduling: Scheduling) => {
      expect(scheduling.recurring_donation_id).not.toBe(RECURRING_DONATION_ID);
    });
    expect(schedulingsDbAfterDelete.length).toBe(
      testSchedules.length - recurringIdCount,
    );
  });

  test("deleteRecurringSchedulingChangeEndDate", async () => {
    await Scheduling.bulkCreate(schedules);
    const res = await schedulingService.deleteSchedulingByRecurringDonationId(
      RECURRING_DONATION_ID,
      testSchedules[3].startTime.toISOString(),
    );
    const schedulingsDbAfterDelete: Scheduling[] = await Scheduling.findAll({
      where: { recurring_donation_id: RECURRING_DONATION_ID },
    });
    schedulingsDbAfterDelete.forEach((scheduling: Scheduling) => {
      expect(scheduling.recurring_donation_end_date).toStrictEqual(
        testSchedules[2].startTime,
      );
    });
  });
});
