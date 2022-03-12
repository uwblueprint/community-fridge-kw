import { BEARER_TOKEN } from "../constants/AuthConstants";
import { CheckIn } from "../types/CheckInTypes";
import baseAPIClient from "./BaseAPIClient";

const getAllCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const { data } = await baseAPIClient.get("/checkin", {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as CheckIn[];
  }
};

const getCheckInsById = async (checkInId: string): Promise<CheckIn> => {
  try {
    const { data } = await baseAPIClient.get(`/checkin/${checkInId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as CheckIn;
  }
};

const getCheckInsByVolunteerId = async (
  volunteerId: string,
): Promise<CheckIn[]> => {
  try {
    const url = `/checkin/volunteers?volunteerId=${volunteerId}`;
    const { data } = await baseAPIClient.get(url, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as CheckIn[];
  }
};

const deleteCheckInById = async (checkInId: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/checkin/${checkInId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return true;
  } catch (error) {
    return false;
  }
};

const deleteCheckInsByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<boolean> => {
  try {
    await baseAPIClient.delete(
      `/checkin?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return true;
  } catch (error) {
    return false;
  }
};

const createCheckIn = async (checkIn: CheckIn): Promise<CheckIn> => {
  try {
    const { data } = await baseAPIClient.post(
      "/checkin",
      {
        ...checkIn,
      },
      { headers: { Authorization: BEARER_TOKEN } },
    );
    return data;
  } catch (error) {
    return error as CheckIn;
  }
};

const updateCheckInById = async (
  checkInId: string,
  fields: CheckIn,
): Promise<CheckIn | boolean> => {
  try {
    const { data } = await baseAPIClient.put(
      `/checkin/${checkInId}`,
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

export default {
  getAllCheckIns,
  getCheckInsById,
  getCheckInsByVolunteerId,
  deleteCheckInById,
  deleteCheckInsByDateRange,
  createCheckIn,
  updateCheckInById,
};