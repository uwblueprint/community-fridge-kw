import { snakeCase } from "lodash";
import User from "../../../models/user.model";
import UserService from "../userService";

import { Role, UserDTO, VolunteerDTO } from "../../../types";

import testSql from "../../../testUtils/testDb";
import VolunteerService from "../volunteerService";
import Volunteer from "../../../models/volunteer.model";

const testUsers = [
  {
    id: "1",
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
  {
    id: "2",
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
    user_id: "1",
  },
  {
    user_id: "2",
  },
];

const testUserVolunteers = [
  {
    id: "1",
    email: "test1@test.com",
    firstName: "Peter",
    lastName: "Pan",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
    userId: "1",
  },
  {
    id: "2",
    email: "test2@test.com",
    firstName: "Wendy",
    lastName: "Darling",
    role: Role.VOLUNTEER,
    phoneNumber: "111-111-1111",
  },
];

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
    };
    const expectedVolunteer = {
      id: 3,
      userId: "1",
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

  it("deleteVolunteerByID", async () => {
    await volunteerService.deleteVolunteerByID("1");

    const res = await volunteerService.getVolunteers();

    expect(res).toHaveLength(1);
  });
});
