import { snakeCase } from "lodash";
import User from "../../../models/user.model";

import { Status, VolunteerDTO } from "../../../types";

import testSql from "../../../testUtils/testDb";
import {
  testUsers,
  testVolunteers,
  testUserVolunteers,
  testUpdatedUserVolunteers,
} from "../../../testUtils/volunteerService";
import VolunteerService from "../volunteerService";
import Volunteer from "../../../models/volunteer.model";

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
