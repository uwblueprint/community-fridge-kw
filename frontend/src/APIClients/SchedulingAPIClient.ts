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
): Promise<Schedule> => {
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
    return error as Schedule;
  }
};

const updateSchedulesByRecurringDonationId = async (
  scheduleId: string,
  fields: UpdatedSchedulingFields,
): Promise<Schedule> => {
  try {
    const { data } = await baseAPIClient.put(
      `/scheduling/${scheduleId}?recurringDonationId=${fields.recurringDonationId}`,
      {
        ...fields,
      },
      { headers: { Authorization: BEARER_TOKEN } },
    );
    return data;
  } catch (error) {
    return error as Schedule;
  }
};

const deleteSchedule = async (scheduleId: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/scheduling/${scheduleId}`, {
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
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(
      `/scheduling?recurringDonationId=${recurringDonationId}&currentDate=${currentDate}`,
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
};
