import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { DonorResponse } from "../types/DonorTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const BEARER_TOKEN = `Bearer ${getLocalStorageObjProperty(
  AUTHENTICATED_USER_KEY,
  "accessToken",
)}`;

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

const updateDonorById = async (
  id: string,
  donorData: any,
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
  updateDonorById,
  deleteDonorById,
};
