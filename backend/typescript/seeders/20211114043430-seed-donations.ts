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
    start_time: new Date(
      "Wed Dec 15 2021 07:00:00 GMT-0500 (Eastern Standard Time)",
    ),
    end_time: new Date(
      "Wed Dec 15 2021 08:00:00 GMT-0500 (Eastern Standard Time)",
    ),
    status: "Approved",
    volunteer_needed: true,
    volunteer_time: "8:00 AM",
    frequency: "One time",
    notes: "these are the notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    donor_id: 1,
    categories: ["Non-perishables", "Tea and coffee"],
    size: "Medium",
    pickup_location: "location",
    day_part: "Night (9pm - 12am)",
    start_time: new Date(
      "Wed Dec 15 2021 22:00:00 GMT-0500 (Eastern Standard Time)",
    ),
    end_time: new Date(
      "Wed Dec 15 2021 23:00:00 GMT-0500 (Eastern Standard Time)",
    ),
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
    is_pickup: true,
    day_part: "Afternoon (11am - 4pm)",
    start_time: new Date(
      "Wed Dec 15 2021 13:00:00 GMT-0500 (Eastern Standard Time)",
    ),
    end_time: new Date(
      "Wed Dec 15 2021 14:00:00 GMT-0500 (Eastern Standard Time)",
    ),
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
