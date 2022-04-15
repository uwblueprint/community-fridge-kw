import { format } from "date-fns";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import { generateCSV } from "../../../utils/CSVUtils";
import { DonationFrequency } from "../Scheduling/types";

const dateText = (date: string) => {
  return format(new Date(date), "MMMM d, yyyy h:mm aa");
};

export const getScheduleCSVData = async () => {
  const schedules = await SchedulingAPIClient.getSchedules();
  const csvData = await Promise.all(
    schedules.map(async (schedule, id) => {
      let volunteer;
      if (schedule.volunteerId) {
        volunteer = await VolunteerAPIClient.getVolunteerById(
          schedule.volunteerId.toString(),
        );
      }

      const donor = await DonorAPIClient.getDonorById(schedule.donorId);
      return {
        ...schedule,
        id,
        startTime: dateText(schedule.startTime),
        endTime: dateText(schedule.endTime),
        recurringDonationEndDate:
          schedule.frequency === DonationFrequency.ONE_TIME
            ? ""
            : dateText(schedule.recurringDonationEndDate),
        volunteerFirstName: volunteer && volunteer.firstName,
        volunteerLastName: volunteer && volunteer.lastName,
        volunteerEmail: volunteer && volunteer.email,
        volunteerPhoneNumber: volunteer && volunteer.phoneNumber,
        donorFirstName: donor.firstName,
        donorLastName: donor.lastName,
        donorEmail: donor.email,
        donorBusinessName: donor.businessName,
        donorPhoneNumber: donor.phoneNumber,
      };
    }),
  );
  const headers = [
    "id",
    "categories",
    "size",
    "isPickup",
    "pickupLocation",
    "dayPart",
    "startTime",
    "endTime",
    "volunteerNeeded",
    "volunteerTime",
    "frequency",
    "recurringDonationEndDate",
    "notes",
    "volunteerFirstName",
    "volunteerLastName",
    "volunteerEmail",
    "volunteerPhoneNumber",
    "donorFirstName",
    "donorLastName",
    "donorEmail",
    "donorBusinessName",
    "donorPhoneNumber",
  ];
  const result = await generateCSV({ data: csvData, fields: headers });
  return result;
};

export const getCheckInCSVData = async () => {
  const checkIns = await CheckInAPIClient.getAllCheckIns();
  const csvData = await Promise.all(
    checkIns.map(async (checkIn, id) => {
      let volunteer;
      if (checkIn.volunteerId) {
        volunteer = await VolunteerAPIClient.getVolunteerById(
          checkIn.volunteerId!.toString(),
        );
      }
      return {
        ...checkIn,
        id,
        startDate: dateText(checkIn.startDate),
        endDate: dateText(checkIn.endDate),
        volunteerFirstName: volunteer && volunteer.firstName,
        volunteerLastName: volunteer && volunteer.lastName,
        volunteerEmail: volunteer && volunteer.email,
        volunteerPhoneNumber: volunteer && volunteer.phoneNumber,
      };
    }),
  );
  const result = await generateCSV({ data: csvData });
  return result;
};
