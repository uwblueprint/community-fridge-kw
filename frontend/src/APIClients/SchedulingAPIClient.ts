import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { Schedule, UpdatedSchedulingFields } from "../types/SchedulingTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

// TO DO: verify that api clients once authorization is enabled
const getSchedules = async (): Promise<Schedule[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/scheduling", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const getScheduleById = async (scheduleId: string): Promise<Schedule> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(`/scheduling/${scheduleId}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return null;
  }
};

const getScheduleByDonorId = async (donorId: string): Promise<Schedule[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get(
      `/scheduling/?donorId=${donorId}`,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  } catch (error) {
    return error as Schedule[];
  }
};

const createSchedule = async (schedule: Schedule): Promise<Schedule> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.post(
      "/scheduling",
      {
        ...schedule,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const updateSchedule = async (
  scheduleId: string,
  fields: UpdatedSchedulingFields,
): Promise<Schedule> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.put(
      `/scheduling/${scheduleId}`,
      {
        ...fields,
      },
      { headers: { Authorization: bearerToken } },
    );
    return data;
  } catch (error) {
    return null;
  }
};

const deleteSchedule = async (scheduleId: string): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.delete(`/scheduling/${scheduleId}`, {
      headers: { Authorization: bearerToken },
    });
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
  deleteSchedule,
};
