import { BEARER_TOKEN } from "../constants/AuthConstants";
import { Schedule, UpdatedSchedulingFields } from "../types/SchedulingTypes";
import baseAPIClient from "./BaseAPIClient";

// TO DO: verify that api clients once authorization is enabled
const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const { data } = await baseAPIClient.get("/scheduling", {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getScheduleById = async (scheduleId: string): Promise<Schedule> => {
  try {
    const { data } = await baseAPIClient.get(`/scheduling/${scheduleId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Schedule;
  }
};

const getScheduleByDonorId = async (
  donorId: string,
  weekLimit: string,
): Promise<Schedule[]> => {
  try {
    const url = `/scheduling/?donorId=${donorId}&weekLimit=${weekLimit}`;
    const { data } = await baseAPIClient.get(url, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Schedule[];
  }
};

const getScheduleByVolunteerId = async (
  volunteerId: string,
): Promise<Schedule[]> => {
  try {
    const url = `/scheduling/volunteers/${volunteerId}`;
    const { data } = await baseAPIClient.get(url, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Schedule[];
  }
};

const getAllSchedulesThatNeedVolunteers = async (
  isVolunteerSlotFilled?: boolean,
): Promise<Schedule[]> => {
  try {
    const url = `/scheduling/volunteers${
      isVolunteerSlotFilled === undefined
        ? ``
        : `/?isVolunteerSlotFilled=${isVolunteerSlotFilled}`
    }`;
    const { data } = await baseAPIClient.get(url, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Schedule[];
  }
};

const getAllSchedulesByPickupOrUnload = async (
  isPickUp: boolean,
): Promise<Schedule[]> => {
  try {
    const url = `/scheduling/pickup/${isPickUp}`;
    const { data } = await baseAPIClient.get(url, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Schedule[];
  }
};

const createSchedule = async (schedule: Schedule): Promise<Schedule> => {
  try {
    const { data } = await baseAPIClient.post(
      "/scheduling",
      {
        ...schedule,
      },
      { headers: { Authorization: BEARER_TOKEN } },
    );
    return data;
  } catch (error) {
    return error as Schedule;
  }
};

const updateSchedule = async (
  scheduleId: string,
  fields: UpdatedSchedulingFields,
): Promise<Schedule | boolean> => {
  try {
    const { data } = await baseAPIClient.put(
      `/scheduling/${scheduleId}`,
      {
        ...fields,
      },
      { headers: { Authorization: BEARER_TOKEN } },
    );
    return data;
  } catch (error) {
    return false;
  }
};

const updateSchedulesByRecurringDonationId = async (
  recurringDonationId: string,
  fields: UpdatedSchedulingFields,
): Promise<boolean> => {
  try {
    await baseAPIClient.put(
      `/scheduling?recurringDonationId=${recurringDonationId}`,
      {
        ...fields,
      },
      { headers: { Authorization: BEARER_TOKEN } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const deleteSchedule = async (
  scheduleId: string,
  userRole: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/scheduling/${scheduleId}?role=${userRole}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const deleteScheduleByRecurringId = async (
  recurringDonationId: string,
  currentDate: string,
  userRole: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(
      `/scheduling?recurringDonationId=${recurringDonationId}&currentDate=${currentDate}&role=${userRole}`,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  getSchedules,
  getScheduleById,
  getScheduleByDonorId,
  createSchedule,
  updateSchedule,
  updateSchedulesByRecurringDonationId,
  deleteSchedule,
  deleteScheduleByRecurringId,
  getScheduleByVolunteerId,
  getAllSchedulesThatNeedVolunteers,
  getAllSchedulesByPickupOrUnload,
};
