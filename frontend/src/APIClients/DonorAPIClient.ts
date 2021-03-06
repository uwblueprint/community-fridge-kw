import { BEARER_TOKEN } from "../constants/AuthConstants";
import { DonorResponse, UpdateDonorDataType } from "../types/DonorTypes";
import baseAPIClient from "./BaseAPIClient";

const getAllDonors = async (): Promise<DonorResponse[]> => {
  try {
    const { data } = await baseAPIClient.get("/donors", {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as DonorResponse[];
  }
};

const getDonorById = async (id: string): Promise<DonorResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/donors/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as DonorResponse;
  }
};

const getDonorByUserId = async (userId: string): Promise<DonorResponse> => {
  try {
    const { data } = await baseAPIClient.get(`/donors/?userId=${userId}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as DonorResponse;
  }
};

const updateDonorById = async (
  id: string,
  donorData: UpdateDonorDataType,
): Promise<DonorResponse> => {
  try {
    const { data } = await baseAPIClient.put(`/donors/${id}`, donorData, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as DonorResponse;
  }
};

const deleteDonorById = async (id: string): Promise<DonorResponse> => {
  try {
    const { data } = await baseAPIClient.delete(`/donors/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as DonorResponse;
  }
};

export default {
  getAllDonors,
  getDonorById,
  getDonorByUserId,
  updateDonorById,
  deleteDonorById,
};
