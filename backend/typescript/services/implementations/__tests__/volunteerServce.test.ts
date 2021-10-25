import { snakeCase } from "lodash";
import User from "../../../models/user.model";
import UserService from "../userService";

import { Role, UserDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";
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
    user_id: 1,
  },
  {
    user_id: 2,
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe.skip("pg userService", () => {
  let userService: UserService;
  let volunteerService: VolunteerService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    userService = new UserService();
    volunteerService = new VolunteerService();
    await User.bulkCreate(testUsers);
    await Volunteer.bulkCreate(testVolunteers);
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("getVolunteers", async () => {
    const volunteers = testUsers.map((user) => {
      const volunteerSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        volunteerSnakeCase[snakeCase(key)] = value;
      });
      return volunteerSnakeCase;
    });

    await User.bulkCreate(volunteers);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user).toContainEqual(testVolunteers[i]);
    });
  });
});
