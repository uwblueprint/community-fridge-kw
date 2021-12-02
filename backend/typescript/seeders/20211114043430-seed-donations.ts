import { Seeder } from "../umzug";

const seedUsers = [
  {
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
    donor_id: 1,
    categories: ["Dry packaged goods"],
    size: "Medium",
    is_pickup: false,
    day_part: "Morning (6am - 11am)",
    start_time: new Date("2021-09-30T00:00:00.000Z"),
    end_time: new Date("2021-10-01T00:00:00.000Z"),
    status: "Approved",
    volunteer_needed: true,
    volunteer_time: "8:00 AM",
    frequency: "One time donation",
    notes: "these are the notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    donor_id: 1,
    categories: ["Non-perishables", "Tea and coffee"],
    size: "Medium",
    is_pickup: true,
    pickup_location: "location",
    day_part: "Morning (6am - 11am)",
    start_time: new Date("2021-09-30T00:00:00.000Z"),
    end_time: new Date("2021-09-30T00:01:00.000Z"),
    status: "Pending",
    volunteer_needed: false,
    frequency: "Weekly",
    recurring_donation_id: "1",
    recurring_donation_end_date: new Date("2022-11-01T00:00:00.000Z"),
    notes: "these are the copied notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    donor_id: 1,
    categories: ["Fresh produce"],
    size: "Small",
    is_pickup: false,
    day_part: "Morning (6am - 11am)",
    start_time: new Date("2021-03-01T06:00:00.000Z"),
    end_time: new Date("2021-03-01T07:00:00.000Z"),
    status: "Approved",
    volunteer_needed: true,
    volunteer_time: "8:00 AM",
    frequency: "Monthly",
    recurring_donation_id: "2",
    recurring_donation_end_date: new Date("2021-10-01T00:06:00.000Z"),
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
    id: [1, 2, 3],
  });
  await sequelize.getQueryInterface().bulkDelete("donors", { id: [1] });
  await sequelize.getQueryInterface().bulkDelete("users", { id: [1] });
};
