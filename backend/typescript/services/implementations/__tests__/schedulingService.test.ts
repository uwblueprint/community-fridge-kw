import { SchedulingDTO, CreateSchedulingDTO } from "../../../types";
import Scheduling from "../../../models/scheduling.model";
import User from "../../../models/user.model";
import Donor from "../../../models/donor.model";
import Volunteer from "../../../models/volunteer.model";
import SchedulingService from "../schedulingService";

import testSql from "../../../testUtils/testDb";
import {
  RECURRING_DONATION_ID,
  testUsersDb,
  testDonorsDb,
  testVolunteersDb,
  testSchedules,
  expectedOneTimeSchedulingResponse,
  expectedDailySchedulingResponse,
  expectedWeeklySchedulingResponse,
  expectedMonthlySchedulingResponse,
} from "../../../testUtils/schedulingService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import IDonorService from "../../interfaces/donorService";
import DonorService from "../donorService";
import { toSnakeCase } from "../../../utilities/servicesUtils";
import IVolunteerService from "../../interfaces/volunteerService";
import VolunteerService from "../volunteerService";
import IContentService from "../../interfaces/contentService";
import ContentService from "../contentService";

const schedules = testSchedules.map((schedule) => {
  return toSnakeCase(schedule);
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
    const volunteerService: IVolunteerService = new VolunteerService();
    const contentService: IContentService = new ContentService();
    
    schedulingService = new SchedulingService(emailService, volunteerService, donorService, contentService);
    await User.bulkCreate(testUsersDb);
    await Donor.bulkCreate(testDonorsDb);
    await Volunteer.bulkCreate(testVolunteersDb);
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

  test("getSchedulingsByVolunteersNeeded", async () => {
    await Scheduling.bulkCreate(schedules);

    const resVoid = await schedulingService.getSchedulingsByVolunteersNeeded();
    const volunteersNeededTestSchedulesVoid = testSchedules.filter(
      (schedule) => schedule.volunteerNeeded,
    );
    expect(resVoid).toMatchObject(volunteersNeededTestSchedulesVoid);

    const resTrue = await schedulingService.getSchedulingsByVolunteersNeeded(
      true,
    );
    const volunteersNeededTestSchedulesTrue = testSchedules.filter(
      (schedule) => schedule.volunteerNeeded && schedule.volunteerId !== null,
    );
    expect(resTrue).toMatchObject(volunteersNeededTestSchedulesTrue);

    const resFalse = await schedulingService.getSchedulingsByVolunteersNeeded(
      false,
    );
    const volunteersNeededTestSchedulesFalse = testSchedules.filter(
      (schedule) => schedule.volunteerNeeded && schedule.volunteerId === null,
    );
    expect(resFalse).toMatchObject(volunteersNeededTestSchedulesFalse);
  });

  test("getSchedulesByDonorId", async () => {
    await Scheduling.bulkCreate(schedules);
    const { donorId } = testSchedules[0];
    const res = await schedulingService.getSchedulingsByDonorId(
      donorId.toString(),
      0,
    );
    const currentDate = new Date();
    expect(res).toMatchObject(
      testSchedules.filter(
        (schedule) =>
          schedule.donorId === donorId && schedule.startTime >= currentDate,
      ),
    );
  });

  test("getScheduleById", async () => {
    await Scheduling.bulkCreate(schedules);
    const res = await schedulingService.getSchedulingById("1");
    expect(res).toMatchObject(testSchedules[0]);
  });

  test("getSchedulesByVolunteerId", async () => {
    await Scheduling.bulkCreate(schedules);
    const { volunteerId } = testSchedules[0];
    const res = await schedulingService.getSchedulingsByVolunteerId(
      (volunteerId ?? "").toString(),
    );
    expect(res).toMatchObject(
      testSchedules.filter((schedule) => schedule.volunteerId === volunteerId),
    );
  });

  test("getSchedulesByPickUp", async () => {
    await Scheduling.bulkCreate(schedules);

    const resPickup = await schedulingService.getSchedulingsByPickUp(true);
    expect(resPickup).toMatchObject(
      testSchedules.filter((schedule) => schedule.isPickup === true),
    );

    const resUnload = await schedulingService.getSchedulingsByPickUp(false);
    expect(resUnload).toMatchObject(
      testSchedules.filter(
        (schedule) =>
          schedule.isPickup === false && schedule.volunteerNeeded === true,
      ),
    );
  });

  test("create one time schedule", async () => {
    const oneTimeSchedule: CreateSchedulingDTO = testSchedules[0];
    await schedulingService.createScheduling(oneTimeSchedule);
    const schedulingDbRes: SchedulingDTO | null = await schedulingService.getSchedulingById(
      "1",
    );
    expect(schedulingDbRes).toEqual(expectedOneTimeSchedulingResponse);
  });
  test("create daily recurring donation schedules", async () => {
    // CREATE DAILY DONATION
    const dailySchedule: CreateSchedulingDTO = testSchedules[1];
    await schedulingService.createScheduling(dailySchedule);
    const dailySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    expect(dailySchedulingDbRes).toEqual(expectedDailySchedulingResponse);
  });

  test("create weekly recurring donation schedules", async () => {
    // CREATE WEEKlY DONATION
    const weeklySchedule: CreateSchedulingDTO = testSchedules[2];
    await schedulingService.createScheduling(weeklySchedule);
    const WeeklySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    expect(WeeklySchedulingDbRes).toEqual(expectedWeeklySchedulingResponse);
  });

  test("create monthly recurring donation schedules", async () => {
    // CREATE MONTHLY DONATION
    const monthlySchedule: CreateSchedulingDTO = testSchedules[3];
    await schedulingService.createScheduling(monthlySchedule);
    const MonthlySchedulingDbRes: SchedulingDTO[] = await schedulingService.getSchedulings();
    expect(MonthlySchedulingDbRes).toEqual(expectedMonthlySchedulingResponse);
  });
  test("updateScheduling", async () => {
    await Scheduling.bulkCreate(schedules);

    // Updating one of each type of field
    const newCategories = ["Tea and coffee"];
    const newVolunteerNeeded = !testSchedules[1].volunteerNeeded;
    const newStartTime: Date = new Date("October 13, 2022 12:00:00");
    const newVolunteerId = "2";

    const resString = await schedulingService.updateSchedulingById("1", {
      categories: newCategories,
    });
    const resNum = await schedulingService.updateSchedulingById("2", {
      volunteerNeeded: newVolunteerNeeded,
    });
    const resDate = await schedulingService.updateSchedulingById("3", {
      startTime: newStartTime,
    });
    const resVolunteer = await schedulingService.updateSchedulingById("2", {
      volunteerId: newVolunteerId,
    });

    expect(resString.categories).toStrictEqual(newCategories);
    expect(resNum.volunteerNeeded).toBe(newVolunteerNeeded);
    expect(resDate.startTime).toEqual(newStartTime);
    expect(resVolunteer.volunteerId).toEqual(newVolunteerId);
  });

  test("deleteScheduling", async () => {
    await Scheduling.bulkCreate(schedules);

    const schedulingToDelete: Scheduling | null = await Scheduling.findOne();
    expect(schedulingToDelete).not.toBeNull();
    if (schedulingToDelete) {
      const res = await schedulingService.deleteSchedulingById(
        schedulingToDelete.id.toString(),
        "Donor",
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
      "Donor",
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
      "Donor",
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
