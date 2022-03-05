import CheckIn from "../../../models/checkIn.model";
import User from "../../../models/user.model";
import Volunteer from "../../../models/volunteer.model";

import testSql from "../../../testUtils/testDb";
import {
  testCheckIns,
  testVolunteersDb,
  testUpdatedCheckIns,
  testUsersDb,
} from "../../../testUtils/checkInService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import CheckInService from "../checkInService";
import VolunteerService from "../volunteerService";
import IVolunteerService from "../../interfaces/volunteerService";

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
    checkInService = new CheckInService(emailService, volunteerService);
    await User.bulkCreate(testUsersDb);
    await Volunteer.bulkCreate(testVolunteersDb);
    await CheckIn.bulkCreate(testCheckIns);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("create single day CheckIn", async () => {
    // pass in the id of a user (1)
    const mockCreateCheckInDTO = {
      userId: "1",
      startDate: new Date("2021-09-01T09:00:00.000Z"),
      endDate: new Date("2021-09-01T00:10:00.000Z"),
      volunteerId: "1",
    };
    const expectedCheckIn = {
      id: "4",
      startDate: new Date("2021-09-01T09:00:00.000Z"),
      endDate: new Date("2021-09-01T00:10:00.000Z"),
      isAdmin: false,
      notes: null,
      volunteerId: "1",
    };

    const res = await checkInService.createCheckIn(mockCreateCheckInDTO);

    expect(res[0]).toEqual(expectedCheckIn);
  });

  it("create multi day CheckIn", async () => {
    // pass in the id of a user (1)
    const mockCreateCheckInDTO = {
      userId: "1",
      startDate: new Date("2021-08-30T09:00:00.000Z"),
      endDate: new Date("2021-09-01T00:10:00.000Z"),
      notes: "hi this is a test",
      isAdmin: true,
    };
    const expectedCheckIn = [
      {
        id: "4",
        startDate: new Date("2021-08-30T09:00:00.000Z"),
        endDate: new Date("2021-08-30T00:10:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: "null",
      },
      {
        id: "5",
        startDate: new Date("2021-08-31T09:00:00.000Z"),
        endDate: new Date("2021-08-31T00:10:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: "null",
      },
      {
        id: "6",
        startDate: new Date("2021-09-01T09:00:00.000Z"),
        endDate: new Date("2021-09-01T00:10:00.000Z"),
        isAdmin: true,
        notes: "hi this is a test",
        volunteerId: "null",
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
});
