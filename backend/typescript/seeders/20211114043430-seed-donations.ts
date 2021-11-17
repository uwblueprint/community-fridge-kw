import { Seeder } from "../umzug";

const seedUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    auth_id: "wzvuBJcZNCaSj7uAkqxEnzduKlD3",
    email: "test@test.org",
    role: "Donor",
    phone_number: "111-111-1111",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedDonors = [
  {
    id: 1,
    user_id: 1,
    business_name: "Joe's Farm",
    facebook_link: "facebook.com",
    instagram_link: "instagram.com",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedSchedules = [
  {
    id: 1,
    donor_id: 1,
    categories: ["Dry packaged goods"],
    size: "medium",
    is_pickup: false,
    start_time: new Date("2021-09-30T00:00:00.000Z"),
    end_time: new Date("2021-10-01T00:00:00.000Z"),
    status: "Approved",
    volunteer_needed: true,
    frequency: "One-time",
    notes: "these are the notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    id: 2,
    donor_id: 1,
    categories: ["Non-perishables", "Tea and coffee"],
    size: "medium",
    is_pickup: true,
    pickup_location: "location",
    start_time: new Date("2021-09-30T00:00:00.000Z"),
    end_time: new Date("2021-10-01T00:00:00.000Z"),
    status: "Pending",
    volunteer_needed: false,
    frequency: "Biweekly",
    notes: "these are the copied notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    id: 3,
    donor_id: 1,
    categories: ["Fresh produce"],
    is_pickup: false,
    start_time: new Date("2021-03-01T00:08:00.000Z"),
    end_time: new Date("2021-03-01T00:06:00.000Z"),
    status: "Approved",
    volunteer_needed: true,
    frequency: "Monthly",
    notes: "these are the copied notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("users", seedUsers);
  await sequelize.getQueryInterface().bulkInsert("donors", seedDonors);
  await sequelize.getQueryInterface().bulkInsert("scheduling", seedSchedules);
};
export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("scheduling", {
    id: seedSchedules.map((schedule) => schedule.id),
  });
  await sequelize
    .getQueryInterface()
    .bulkDelete("donors", { id: seedDonors.map((donor) => donor.id) });
  await sequelize
    .getQueryInterface()
    .bulkDelete("users", { id: seedUsers.map((user) => user.id) });
};
