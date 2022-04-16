import CheckIn from "../../../models/checkIn.model";
import User from "../../../models/user.model";
import Volunteer from "../../../models/volunteer.model";

import testSql from "../../../testUtils/testDb";
import {
  testCheckIns,
  testUpdatedCheckIns,
  testVolunteersDb,
  testUsersDb,
} from "../../../testUtils/checkInService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import CheckInService from "../checkInService";
import { toSnakeCase } from "../../../utilities/servicesUtils";
import IVolunteerService from "../../interfaces/volunteerService";
import VolunteerService from "../volunteerService";
import IContentService from "../../interfaces/contentService";
import ContentService from "../contentService";

const checkIns = testCheckIns.map((checkIn) => {
  return toSnakeCase(checkIn);
});

jest.mock("nodemailer", () => {
  const createTransport = jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  });
  return { createTransport };
});

describe("pg checkInService", () => {
  let checkInService: CheckInService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    const emailService: IEmailService = new EmailService(nodemailerConfig);
    const volunteerService: IVolunteerService = new VolunteerService();
    const contentService: IContentService = new ContentService();
    checkInService = new CheckInService(
      emailService,
      volunteerService,
      contentService,
    );
    await User.bulkCreate(testUsersDb);
    await Volunteer.bulkCreate(testVolunteersDb);
    await CheckIn.bulkCreate(checkIns);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("create single day CheckIn", async () => {
    // pass in the id of a user (1)
    const mockCreateCheckInDTO = {
      startDate: new Date("2021-09-01T09:00:00.000Z"),
      endDate: new Date("2021-09-01T10:00:00.000Z"),
    };
    const expectedCheckIn = {
      id: "5",
      startDate: new Date("2021-09-01T09:00:00.000Z"),
      endDate: new Date("2021-09-01T10:00:00.000Z"),
      isAdmin: false,
      notes: null,
      volunteerId: null,
    };

    const res = await checkInService.createCheckIn(mockCreateCheckInDTO);

    expect(res[0]).toEqual(expectedCheckIn);
  });

  it("create multi day CheckIn", async () => {
    const mockCreateCheckInDTO = {
      userId: "1",
      startDate: new Date("2021-08-30T09:00:00.000Z"),
      endDate: new Date("2021-09-01T10:00:00.000Z"),
      notes: "hi this is a test",
      isAdmin: true,
    };
    const expectedCheckIn = [
      {
        id: "5",
        startDate: new Date("2021-08-30T09:00:00.000Z"),
        endDate: new Date("2021-08-30T10:00:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: null,
      },
      {
        id: "6",
        startDate: new Date("2021-08-31T09:00:00.000Z"),
        endDate: new Date("2021-08-31T10:00:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: null,
      },
      {
        id: "7",
        startDate: new Date("2021-09-01T09:00:00.000Z"),
        endDate: new Date("2021-09-01T10:00:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: null,
      },
    ];

    const res = await checkInService.createCheckIn(mockCreateCheckInDTO);

    expect(res).toEqual(expectedCheckIn);
  });

  it("updateCreateCheckIn", async () => {
    const mockUpdateCheckinDTO = {
      notes: "updated notes",
      volunteerId: "1",
    };

    const updatedCheckIn = await checkInService.updateCheckInById(
      "1",
      mockUpdateCheckinDTO,
    );

    expect(updatedCheckIn).toMatchObject(testUpdatedCheckIns[0]);
  });

  test("getCheckIns", async () => {
    const res = await checkInService.getAllCheckIns();
    expect(res).toMatchObject(testCheckIns);
  });

  test("getCheckInsById", () => {
    testCheckIns.forEach(async (checkIn, i) => {
      const res = await checkInService.getCheckInsById((i + 1).toString());
      expect(res).toMatchObject(checkIn);
    });
  });

  test("getCheckInsByVolunteerId", async () => {
    const { volunteerId } = testCheckIns[1];
    const res = await checkInService.getCheckInsByVolunteerId(
      (volunteerId ?? "").toString(),
    );
    expect(res).toMatchObject(
      testCheckIns.filter((checkIn) => checkIn.volunteerId === volunteerId),
    );
  });

  test("deleteCheckInById", async () => {
    const checkInToDelete: CheckIn | null = await CheckIn.findOne();
    expect(checkInToDelete).not.toBeNull();
    if (checkInToDelete) {
      await checkInService.deleteCheckInById(checkInToDelete.id.toString());
      const checkInsDbAfterDelete: CheckIn[] = await CheckIn.findAll();
      checkInsDbAfterDelete.forEach((checkIn: CheckIn, i) => {
        expect(checkIn.id).not.toBe(checkInToDelete.id);
      });
      expect(checkInsDbAfterDelete.length).toBe(testCheckIns.length - 1);
    }
  });

  test("deleteCheckInsByDateRange", async () => {
    const startDate = "2021-09-01T09:00:00.000Z";
    const endDate = "2021-09-07T10:00:00.000Z";
    await checkInService.deleteCheckInsByDateRange(startDate, endDate);
    const checkInsDbAfterDelete: CheckIn[] = await CheckIn.findAll();
    const expected = testCheckIns.filter(
      (checkIn) =>
        !(
          checkIn.startDate >= new Date(startDate) &&
          checkIn.endDate <= new Date(endDate)
        ),
    );
    expect(checkInsDbAfterDelete.length).toBe(expected.length);
  });
});
