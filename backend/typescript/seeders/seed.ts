import { Seeder } from "../umzug";
import { Role, Status } from "../types";

const seedUsers = [
  {
    first_name: "Celine",
    last_name: "Dion",
    auth_id: process.env.ADMIN_AUTH_ID,
    email: "admin-cfkw@uwblueprint.org",
    role: Role.ADMIN,
    phone_number: "1111111111",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    first_name: "Sandra",
    last_name: "Oh",
    auth_id: process.env.DONOR_AUTH_ID,
    email: "donor-cfkw@uwblueprint.org",
    role: Role.DONOR,
    phone_number: "111-111-1111",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
  {
    first_name: "Roberta",
    last_name: "Bondar",
    auth_id: process.env.VOLUNTEER_AUTH_ID,
    email: "volunteer-cfkw@uwblueprint.org",
    role: Role.VOLUNTEER,
    phone_number: "111-111-1111",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedDonors = [
  {
    user_id: 2,
    business_name: "Joe's Farm",
    facebook_link: "facebook.com",
    instagram_link: "instagram.com",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedVolunteers = [
  {
    user_id: 3,
    status: Status.APPROVED,
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
    volunteer_time: new Date(1636226732806),
    volunteer_id: 1,
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
    volunteer_id: 1,
    volunteer_time: "8:00 AM",
    frequency: "Monthly",
    recurring_donation_id: "2",
    recurring_donation_end_date: new Date("2021-10-01T00:06:00.000Z"),
    notes: "these are the copied notes",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedContent = [
  {
    food_rescue_description:
      "Food rescue shifts assist with donations, either through unloading at the fridge or picking up off-site and bringing it to the fridge. For more information, check out the link here:",
    food_rescue_url: "https://www.google.com/",
    checkin_description:
      "Community fridge check-in shifts are done daily to maintain health standards. Tasks include inventory and cleaning. Note: shifts typically take half an hour, and you can arrive any time within your time window. For detailed instructions, click this link:",
    checkin_url: "https://www.google.com/",
    createdAt: new Date(1636226732806),
    updatedAt: new Date(1636226732806),
  },
];

const seedCheckins = [
  {
    volunteer_id: 1,
    start_date: new Date("1 March 2022"),
    end_date: new Date("2 May 2022"),
    notes: "Please remember to bring your own handsanitizer!",
    createdAt: new Date(1647818578000),
    updatedAt: new Date(1649989378000),
  },
  {
    start_date: new Date(),
    end_date: new Date(),
    notes:
      "Make sure to follow proper health and safety guidelines before coming to the fridge.",
    is_admin: true,
    createdAt: new Date(1647818578000),
    updatedAt: new Date(1649989378000),
  },
  {
    volunteer_id: 1,
    start_date: new Date(),
    end_date: new Date(),
    notes: "Please remember to bring your own handsanitizer!",
    createdAt: new Date(1647818578000),
    updatedAt: new Date(1649989378000),
  },
];

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("users", seedUsers);
  await sequelize.getQueryInterface().bulkInsert("donors", seedDonors);
  await sequelize.getQueryInterface().bulkInsert("volunteers", seedVolunteers);
  await sequelize.getQueryInterface().bulkInsert("scheduling", seedSchedules);
  await sequelize.getQueryInterface().bulkInsert("content", seedContent);
  await sequelize.getQueryInterface().bulkInsert("checkin", seedCheckins);
};
export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("scheduling", {
    id: [1, 2, 3],
  });
  await sequelize.getQueryInterface().bulkDelete("checkin", { id: [1, 2, 3] });
  await sequelize.getQueryInterface().bulkDelete("donors", { id: [1] });
  await sequelize.getQueryInterface().bulkDelete("volunteers", { id: [1] });
  await sequelize.getQueryInterface().bulkDelete("users", { id: [1, 2, 3] });
  await sequelize.getQueryInterface().bulkDelete("content", { id: [1] });
};
