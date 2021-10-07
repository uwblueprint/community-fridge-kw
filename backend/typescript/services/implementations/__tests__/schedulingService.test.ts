import { snakeCase } from "lodash";
import Scheduling from "../../../models/scheduling.model";
import SchedulingService from "../schedulingService";

import { SchedulingDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";

const testSchedules = [
    {
        donorId: 2,
        description: "this is a description",
        quantity: 2,
        startTime: "2021-09-30T00:00:00.000Z",
        endTime: "2021-10-01T00:00:00.000Z",
        status: "Pending",
        volunteersNeeded: 2,
        notes: "these are the notes"
    },
    {
        donorId: 3,
        description: "this is a copied description",
        quantity: 3,
        startTime: "2021-09-30T00:00:00.000Z",
        endTime: "2021-10-01T00:00:00.000Z",
        status: "Pending",
        volunteersNeeded: 2,
        notes: "these are the copied notes"
    }
]
//!! WIP !!
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
        expect(user.firstName).toEqual(testUsers[i].firstName);
        expect(user.lastName).toEqual(testUsers[i].lastName);
        expect(user.role).toEqual(testUsers[i].role);
      });
    });
  });