import { snakeCase } from "lodash";
import User from "../../../models/user.model";
import UserService from "../userService";

import { UserDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: "Admin",
    phoneNumber: "111-111-1111",
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: "User",
    phoneNumber: "111-111-1111",
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

  beforeEach(async () => {
    await testSql.sync({ force: true });
    userService = new UserService();
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("getUsers", async () => {
    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user).toContainEqual(testUsers[i]);
    });
  });
});
