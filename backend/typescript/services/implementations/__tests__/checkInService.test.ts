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
    checkInService = new CheckInService();
    const volunteerService: IVolunteerService = new VolunteerService();
    checkInService = new CheckInService(volunteerService);
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

  test("deleteCheckInById", async () => {
    const checkInToDelete: CheckIn | null = await CheckIn.findOne();
    expect(checkInToDelete).not.toBeNull();
    if (checkInToDelete) {
      const res = await checkInService.deleteCheckInById(
        checkInToDelete.id.toString(),
      );
      const checkInsDbAfterDelete: CheckIn[] = await CheckIn.findAll();
      checkInsDbAfterDelete.forEach((checkIn: CheckIn, i) => {
        expect(checkIn.id).not.toBe(checkInToDelete.id);
      });
      expect(checkInsDbAfterDelete.length).toBe(testCheckIns.length - 1);
    }
  });

  test("deleteCheckInsByDateRange", async () => {
    const startDate = "2021-09-01T09:00:00.000Z";
    const endDate = "2021-09-07T00:10:00.000Z";
    const res = await checkInService.deleteCheckInsByDateRange(
      startDate,
      endDate,
    );
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
