import { snakeCase } from "lodash";
import User from "../../../models/user.model";

import { Role, Status, VolunteerDTO } from "../../../types";

import testSql from "../../../testUtils/testDb";
import VolunteerService from "../volunteerService";
import Volunteer from "../../../models/volunteer.model";

const testUsers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
];

const testVolunteers = [
  {
    userId: "1",
    status: Status.PENDING,
  },
  {
    userId: "2",
    status: Status.PENDING,
  },
];

const testUserVolunteers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "1",
    status: Status.PENDING,
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "2",
    status: Status.PENDING,
  },
];

const testUpdatedUserVolunteers = [
  {
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "1",
    status: Status.APPROVED,
  },
  {
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "2",
    status: Status.REJECTED,
  },
];

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
    volunteerService = new VolunteerService();

    // translate frontend camel case into backend snake case format
    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    const volunteers = testVolunteers.map((volunteer) => {
      const volunteerSnakeCase: Record<string, string> = {};
      Object.entries(volunteer).forEach(([key, value]) => {
        volunteerSnakeCase[snakeCase(key)] = value;
      });
      return volunteerSnakeCase;
    });

    // bulk create all users and volunteers using the user and volunteer models
    await User.bulkCreate(users);
    await Volunteer.bulkCreate(volunteers);
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

  it("getVolunteerByID", async () => {
    const res = await volunteerService.getVolunteerByID("1");

    expect(res).toMatchObject(testUserVolunteers[0]);
  });

  it("getVolunteers", async () => {
    const res = await volunteerService.getVolunteers();

    res.forEach((volunteer: VolunteerDTO, i: number) => {
      expect(volunteer).toMatchObject(testUserVolunteers[i]);
    });
  });

  it("updateVolunteerById", async () => {
    const mockUpdateVolunteerDTO = {
      userId: "1",
      status: Status.APPROVED,
    };

    await volunteerService.updateVolunteerById("1", mockUpdateVolunteerDTO);

    const res = await volunteerService.getVolunteerByID("1");

    expect(res).toMatchObject(testUpdatedUserVolunteers[0]);
  });

  it("updateVolunteerByUserId", async () => {
    const mockUpdateVolunteerDTO = {
      id: "2",
      userId: "2",
      status: Status.REJECTED,
    };

    await volunteerService.updateVolunteerByUserId("2", mockUpdateVolunteerDTO);

    const res = await volunteerService.getVolunteerByID("2");

    expect(res).toMatchObject(testUpdatedUserVolunteers[0]);
  });

  it("deleteVolunteerByID", async () => {
    await volunteerService.deleteVolunteerByID("1");

    const res = await volunteerService.getVolunteers();

    expect(res).toHaveLength(1);
  });
});
