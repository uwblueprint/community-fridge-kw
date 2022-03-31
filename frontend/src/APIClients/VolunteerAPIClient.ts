import { BEARER_TOKEN } from "../constants/AuthConstants";
import {
  UpdateVolunteerDataType,
  VolunteerResponse,
} from "../types/VolunteerTypes";
import baseAPIClient from "./BaseAPIClient";

const getAllVolunteers = async (): Promise<VolunteerResponse[]> => {
  try {
    const { data } = await baseAPIClient.get("/volunteers", {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as VolunteerResponse[];
  }
};

const getVolunteerById = async (id: string): Promise<VolunteerResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/volunteers/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as VolunteerResponse;
  }
};

const getVolunteerByUserId = async (
  userId: string,
): Promise<VolunteerResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/volunteers/?userId=${userId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as VolunteerResponse;
  }
};

const getCheckInsAndSchedules = async (
  volunteerId: string,
): Promise<VolunteerResponse[]> => {
  try {
    const { data } = await baseAPIClient.get(
      `/volunteers/shifts/${volunteerId}`,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as VolunteerResponse[];
  }
};

const updateVolunteerById = async (
  id: string,
  volunteerData: UpdateVolunteerDataType,
): Promise<VolunteerResponse> => {
  try {
    const { data } = await baseAPIClient.put(
      `/volunteers/${id}`,
      volunteerData,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as VolunteerResponse;
  }
};

const updateVolunteerByUserId = async (
  userId: string,
  volunteerData: UpdateVolunteerDataType,
): Promise<VolunteerResponse> => {
  try {
    const { data } = await baseAPIClient.put(
      `/volunteers/?userId=${userId}`,
      volunteerData,
      {
        headers: { Authorization: BEARER_TOKEN },
      },
    );
    return data;
  } catch (error) {
    return error as VolunteerResponse;
  }
};

const deleteVolunteerById = async (id: string): Promise<VolunteerResponse> => {
  try {
    const { data } = await baseAPIClient.delete(`/volunteers/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as VolunteerResponse;
  }
};

export default {
  getAllVolunteers,
  getVolunteerById,
  getVolunteerByUserId,
  getCheckInsAndSchedules,
  updateVolunteerById,
  updateVolunteerByUserId,
  deleteVolunteerById,
};
