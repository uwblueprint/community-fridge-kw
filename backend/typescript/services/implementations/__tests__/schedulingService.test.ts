import { snakeCase } from "lodash";
import Scheduling from "../../../models/scheduling.model";
import User from "../../../models/user.model";
import Donor from "../../../models/donor.model";
import SchedulingService from "../schedulingService";

import { Status, CreateSchedulingDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";

type SchedulingKey = keyof typeof Scheduling

const testUsersDb = [
  {
    first_name: "Test",
    last_name: "User",
    auth_id: "test id",
    role: "Donor"
  },
  {
    first_name: "Test",
    last_name: "User 2",
    auth_id: "test id 2",
    role: "Donor"
  },
]

const testDonorsDb = [
  {
    user_id: 1,
    donor_type: "LocalBusiness",
  },
  {
    user_id: 2,
    donor_type: "IndividualDonor",
  }
]

const testSchedules = [
  {
      donorId: 1,
      description: "this is a description",
      quantity: 2,
      pickupLocation: "location",
      startTime: new Date("2021-09-30T00:00:00.000Z"),
      endTime: new Date("2021-10-01T00:00:00.000Z"),
      status: "Pending",
      volunteersNeeded: 2,
      notes: "these are the notes"
  },
  {
      donorId: 2,
      description: "this is a copied description",
      quantity: 3,
      pickupLocation: "copied location",
      startTime: new Date("2021-09-30T00:00:00.000Z"),
      endTime: new Date("2021-10-01T00:00:00.000Z"),
      status: "Pending",
      volunteersNeeded: 2,
      notes: "these are the copied notes"
  },
  {
    donorId: 1,
    description: "this is a copied description",
    quantity: 2,
    pickupLocation: "copied location",
    startTime: new Date("2021-03-01T00:08:00.000Z"),
    endTime: new Date("2021-03-01T00:06:00.000Z"),
    status: "Pending",
    volunteersNeeded: 0,
    notes: "these are the copied notes"
  }
]

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
        const scheduleSnakeCase: Record<string, string|number|Date> = {};
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
        const scheduleSnakeCase: Record<string, string|number|Date> = {};
        Object.entries(schedule).forEach(([key, value]) => {
          scheduleSnakeCase[snakeCase(key)] = value;
        });
        return scheduleSnakeCase;
      });

      await Scheduling.bulkCreate(schedules);
      const donorId = testSchedules[0].donorId
      const res = await schedulingService.getSchedulingsByDonorId(donorId);
      expect(res).toMatchObject(testSchedules.filter(schedule => schedule.donorId == donorId));
    });

    test("getScheduleById", async () => {
      const schedules = testSchedules.map((schedule) => {
        const scheduleSnakeCase: Record<string, string|number|Date> = {};
        Object.entries(schedule).forEach(([key, value]) => {
          scheduleSnakeCase[snakeCase(key)] = value;
        });
        return scheduleSnakeCase;
      });

      await Scheduling.bulkCreate(schedules);
      const res = await schedulingService.getSchedulingById(1);
      expect(res).toMatchObject(testSchedules[0]);
    });

    test("createScheduling", async () => {
      const startTime: Date = new Date("October 13, 2014 11:13:00");
      const endTime: Date = new Date("October 13, 2014 11:13:00");
      const status: Status = "Pending";
      const schedulingToCreate: CreateSchedulingDTO = {
        ...testSchedules[0],
        status: status,
        startTime: startTime,
        endTime: endTime
      }

      const res = await schedulingService.createScheduling(schedulingToCreate);

      const schedulingDbRes: Scheduling | null = await Scheduling.findByPk(1);
      if (schedulingDbRes) {
        for (const key in schedulingToCreate) {
          expect(schedulingDbRes[snakeCase(key) as keyof Scheduling]).toEqual(schedulingToCreate[key as keyof CreateSchedulingDTO]);
        }
      }
    });

    test("updateScheduling", async () => {
      const schedules = testSchedules.map((schedule) => {
        const scheduleSnakeCase: Record<string, string|number|Date> = {};
        Object.entries(schedule).forEach(([key, value]) => {
          scheduleSnakeCase[snakeCase(key)] = value;
        });
        return scheduleSnakeCase;
      });

      await Scheduling.bulkCreate(schedules);

      // Updating one of each type of field
      const newDescription : string = "this is an updated description";
      const newVolunteersNeeded : number = 10;
      const newStartTime: Date = new Date("October 13, 2022 12:00:00");

      const resString = await schedulingService.updateSchedulingById(1, {description: newDescription});
      const resNum = await schedulingService.updateSchedulingById(2, {volunteersNeeded: newVolunteersNeeded});
      const resDate = await schedulingService.updateSchedulingById(3, {startTime: newStartTime});

      expect(resString.description).toBe(newDescription);
      expect(resNum.volunteersNeeded).toBe(newVolunteersNeeded);
      expect(resDate.startTime).toEqual(newStartTime);
    });

    test("deleteScheduling", async () => {
      const schedules = testSchedules.map((schedule) => {
        const scheduleSnakeCase: Record<string, string|number|Date> = {};
        Object.entries(schedule).forEach(([key, value]) => {
          scheduleSnakeCase[snakeCase(key)] = value;
        });
        return scheduleSnakeCase;
      });

      await Scheduling.bulkCreate(schedules);

      const schedulingToDelete: Scheduling | null = await Scheduling.findOne();
      expect(schedulingToDelete).not.toBeNull();
      if (schedulingToDelete) {
        const res = await schedulingService.deleteSchedulingById(schedulingToDelete.id)
        const schedulingsDbAfterDelete: Scheduling[] = await Scheduling.findAll();
        schedulingsDbAfterDelete.forEach((scheduling: Scheduling, i) => {
          expect(scheduling.id).not.toBe(schedulingToDelete.id);
        })
      }
    });
  });