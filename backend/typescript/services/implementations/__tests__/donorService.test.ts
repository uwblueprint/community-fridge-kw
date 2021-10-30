import { snakeCase } from "lodash";
import Donor from "../../../models/donor.model";
import DonorService from "../donorService";

import { DonorDTO } from "../../../types";

import { testSql } from "../../../testUtils/testDb";
import User from "../../../models/user.model";

const testUsers = [
  {
    firstName: "Taylor",
    lastName: "Swift",
    email: "taylor@test.com",
    authId: "321",
    role: "Donor",
    phoneNumber: "123-456-7890",
  },
  {
    firstName: "Kanye",
    lastName: "West",
    email: "kanye@test.com",
    authId: "123",
    role: "Donor",
    phoneNumber: "111-1111",
  },
];

const testDonors = [
  {
    userId: "1",
    businessName: "Shake it off",
  },
  {
    userId: "2",
    businessName: "yeezy",
  },
];

const testUserDonors = [
  {
    businessName: "Shake it off",
    email: "taylor@test.com",
    facebookLink: null,
    firstName: "Taylor",
    id: "1",
    instagramLink: null,
    lastName: "Swift",
    phoneNumber: "123-456-7890",
    role: "Donor",
    userId: "1",
  },
  {
    businessName: "yeezy",
    email: "kanye@test.com",
    facebookLink: null,
    firstName: "Kanye",
    id: "2",
    instagramLink: null,
    lastName: "West",
    phoneNumber: "111-1111",
    role: "Donor",
    userId: "2",
  },
];

const testUpdatedUserDonors = [
  {
    businessName: "Fearless",
    email: "taylor@test.com",
    facebookLink: null,
    firstName: "Taylor",
    id: "1",
    instagramLink: null,
    lastName: "Swift",
    phoneNumber: "123-456-7890",
    role: "Donor",
    userId: "1",
  },
  {
    businessName: "yeezy",
    email: "kanye@test.com",
    facebookLink: null,
    firstName: "Kanye",
    id: "2",
    instagramLink: null,
    lastName: "West",
    phoneNumber: "111-1111",
    role: "Donor",
    userId: "2",
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
});

describe("Testing DonorService functions", () => {
  let donorService: DonorService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    donorService = new DonorService();
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("testing getDonors", async () => {
    const donors = testDonors.map((donor) => {
      const donorSnakeCase: Record<string, string> = {};
      Object.entries(donor).forEach(([key, value]) => {
        donorSnakeCase[snakeCase(key)] = value;
      });
      return donorSnakeCase;
    });

    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);

    await Donor.bulkCreate(donors);

    const res = await donorService.getDonors();

    res.forEach((donor: DonorDTO, i) => {
      expect(donor).toMatchObject(testUserDonors[i]);
    });
  });

  it("testing getDonorById", async () => {
    const testDonorId = "1";

    const donors = testDonors.map((donor) => {
      const donorSnakeCase: Record<string, string> = {};
      Object.entries(donor).forEach(([key, value]) => {
        donorSnakeCase[snakeCase(key)] = value;
      });
      return donorSnakeCase;
    });

    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);

    await Donor.bulkCreate(donors);

    const res = await donorService.getDonorById(testDonorId);

    expect(res).toMatchObject(testUserDonors[0]);
  });

  it("testing createDonor", async () => {
    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);

    const mockCreateDonorDTO = {
      userId: "1",
      businessName: "Shake it off",
    };

    const res = await donorService.createDonor(mockCreateDonorDTO);

    expect(res).toMatchObject(testDonors[0]);
  });

  it("testing updateDonorById", async () => {
    const donors = testDonors.map((donor) => {
      const donorSnakeCase: Record<string, string> = {};
      Object.entries(donor).forEach(([key, value]) => {
        donorSnakeCase[snakeCase(key)] = value;
      });
      return donorSnakeCase;
    });

    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);
    await Donor.bulkCreate(donors);

    const mockUpdateDonorDTO = {
      userId: "1",
      businessName: "Fearless",
    };

    await donorService.updateDonorById("1", mockUpdateDonorDTO);

    const res = await donorService.getDonorById("1");

    expect(res).toMatchObject(testUpdatedUserDonors[0]);
  });

  it("testing deleteDonorById", async () => {
    const donors = testDonors.map((donor) => {
      const donorSnakeCase: Record<string, string> = {};
      Object.entries(donor).forEach(([key, value]) => {
        donorSnakeCase[snakeCase(key)] = value;
      });
      return donorSnakeCase;
    });

    const users = testUsers.map((user) => {
      const userSnakeCase: Record<string, string> = {};
      Object.entries(user).forEach(([key, value]) => {
        userSnakeCase[snakeCase(key)] = value;
      });
      return userSnakeCase;
    });

    await User.bulkCreate(users);
    await Donor.bulkCreate(donors);

    await donorService.deleteDonorById("1");

    const res = await donorService.getDonors();

    expect(res).toHaveLength(1);
  });
});
