import User from "../../../models/user.model";
import { ShiftType, Status, VolunteerDTO } from "../../../types";
import testSql from "../../../testUtils/testDb";
import {
  testUsers,
  testVolunteers,
  testUserVolunteers,
  testUpdatedUserVolunteers,
} from "../../../testUtils/volunteerService";
import VolunteerService from "../volunteerService";
import Volunteer from "../../../models/volunteer.model";
import Scheduling from "../../../models/scheduling.model";
import Donor from "../../../models/donor.model";
import CheckIn from "../../../models/checkIn.model";
import IDonorService from "../../interfaces/donorService";
import DonorService from "../donorService";
import { testDonorsDb } from "../../../testUtils/schedulingService";
import {
  testUsers,
  testVolunteers,
  testUserVolunteers,
  testUpdatedUserVolunteers,
  testSchedules,
  testCheckIns,
  expectedCheckInsAndSchedules,
} from "../../../testUtils/volunteerService";
import { toSnakeCase } from "../../../utilities/servicesUtils";

// translate frontend camel case into backend snake case format
const users = testUsers.map((user) => {
  return toSnakeCase(user);
});
const volunteers = testVolunteers.map((volunteer) => {
  return toSnakeCase(volunteer);
});
const checkIns = testCheckIns.map((checkIn) => {
  return toSnakeCase(checkIn);
});
const schedules = testSchedules.map((schedule) => {
  return toSnakeCase(schedule);
});
const donors = testDonorsDb.map((donor) => {
  return toSnakeCase(donor);
});

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("Testing VolunteerService Functions", () => {
  let volunteerService: VolunteerService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    const donorService: IDonorService = new DonorService();
    volunteerService = new VolunteerService();

    // bulk create all users and volunteers using the user and volunteer models
    await User.bulkCreate(users);
    await Volunteer.bulkCreate(volunteers);
    await Donor.bulkCreate(donors);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("createVolunteer", async () => {
    // pass in the id of a user (1)
    const mockCreateVolunteerDTO = {
      userId: "1",
      status: Status.PENDING,
    };
    const expectedVolunteer = {
      id: 3,
      userId: "1",
      status: Status.PENDING,
    };

    // add the new volunteer to the array with id 3 and userId of what was passed (1)
    const res = await volunteerService.createVolunteer(mockCreateVolunteerDTO);

    expect(res).toEqual(expectedVolunteer);
  });

  it("getVolunteerById", async () => {
    const res = await volunteerService.getVolunteerById("1");

    expect(res).toMatchObject(testUserVolunteers[0]);
  });

  it("getVolunteers", async () => {
    const res = await volunteerService.getVolunteers();

    res.forEach((volunteer: VolunteerDTO, i: number) => {
      expect(volunteer).toMatchObject(testUserVolunteers[i]);
    });
  });

  it("getCheckInsAndSchedulesByVolunteerId", async () => {
    await CheckIn.bulkCreate(checkIns);
    await Scheduling.bulkCreate(schedules);

    const res = await volunteerService.getCheckInsAndSchedules("1");

    expect(res).toMatchObject(
      expectedCheckInsAndSchedules.filter(
        (shift) =>
          (shift.type === ShiftType.CHECKIN &&
            shift.startDate! >= new Date()) ||
          (shift.type === ShiftType.SCHEDULING &&
            shift.startTime! >= new Date()),
      ),
    );
  });

  it("updateVolunteerById", async () => {
    const mockUpdateVolunteerDTO = {
      status: Status.APPROVED,
    };

    await volunteerService.updateVolunteerById("1", mockUpdateVolunteerDTO);

    const res = await volunteerService.getVolunteerById("1");

    expect(res).toMatchObject(testUpdatedUserVolunteers[0]);
  });

  it("updateVolunteerByUserId", async () => {
    const mockUpdateVolunteerDTO = {
      status: Status.REJECTED,
    };

    await volunteerService.updateVolunteerByUserId("2", mockUpdateVolunteerDTO);

    const res = await volunteerService.getVolunteerById("2");

    expect(res).toMatchObject(testUpdatedUserVolunteers[1]);
  });

  it("deleteVolunteerById", async () => {
    await volunteerService.deleteVolunteerById("1");

    const res = await volunteerService.getVolunteers();

    expect(res).toHaveLength(1);
  });
});
