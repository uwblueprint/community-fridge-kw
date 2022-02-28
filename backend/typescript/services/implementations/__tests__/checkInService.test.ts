import { snakeCase } from "lodash";
import CheckIn from "../../../models/checkIn.model";
import Volunteer from "../../../models/volunteer.model";
import User from "../../../models/user.model";
import testSql from "../../../testUtils/testDb";
import testCheckIns from "../../../testUtils/checkInService";
import {
  testUsersDb,
  testVolunteersDb,
} from "../../../testUtils/schedulingService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import CheckInService from "../checkInService";
import VolunteerService from "../volunteerService";
import IVolunteerService from "../../interfaces/volunteerService";

const checkIns = testCheckIns.map((checkIn) => {
  const checkInsSnakeCase: Record<
    string,
    string | number | boolean | string[] | Date | null | undefined
  > = {};
  Object.entries(checkIn).forEach(([key, value]) => {
    checkInsSnakeCase[snakeCase(key)] = value;
  });
  return checkInsSnakeCase;
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
    checkInService = new CheckInService();
    const emailService: IEmailService = new EmailService(nodemailerConfig);
    const volunteerService: IVolunteerService = new VolunteerService();
    checkInService = new CheckInService(emailService, volunteerService);
    await User.bulkCreate(testUsersDb);
    await Volunteer.bulkCreate(testVolunteersDb);
    await CheckIn.bulkCreate(checkIns);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
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
});
