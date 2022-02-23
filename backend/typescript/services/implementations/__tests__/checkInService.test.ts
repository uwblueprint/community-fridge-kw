import { snakeCase } from "lodash";
import CheckIn from "../../../models/checkIn.model";
import {
  CheckInDTO
} from "../../../types";
import User from "../../../models/user.model";
import Volunteer from "../../../models/volunteer.model";

import testSql from "../../../testUtils/testDb";
import {
  testCheckIns,
  testVolunteersDb
} from "../../../testUtils/checkInService";
import nodemailerConfig from "../../../nodemailer.config";
import IEmailService from "../../interfaces/emailService";
import EmailService from "../emailService";
import CheckInService from "../checkInService";
import VolunteerService from "../volunteerService";
import IVolunteerService from "../../interfaces/volunteerService";

const checkIns = testCheckIns.map((checkIn) => {
  const checkInSnakeCase: Record<
    string,
    string | Date | Date | string | boolean | null
  > = {};
  Object.entries(checkIn).forEach(([key, value]) => {
    checkInSnakeCase[snakeCase(key)] = value;
  });
  return checkInSnakeCase;
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
    checkInService = new CheckInService(emailService, volunteerService);
    await Volunteer.bulkCreate(testVolunteersDb);
    await CheckIn.bulkCreate(testCheckIns);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });
});

it("createCheckIn", async() => {
    // pass in the id of a user (1)
    const mockCreateCheckInDTO = {
        userId: "1",
        startTime: new Date("2021-09-01T09:00:00.000Z"),
        endTime: new Date("2021-09-01T00:10:00.000Z"),
    };
    const expectedCheckIn = {
        id: 4,
        userId: "1",
        startTime: new Date("2021-09-01T09:00:00.000Z"),
        endTime: new Date("2021-09-01T00:10:00.000Z"),
    };
});