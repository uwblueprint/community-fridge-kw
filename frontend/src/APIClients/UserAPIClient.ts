import { AUTHENTICATED_USER_KEY } from "../constants/AuthConstants";
import { Role } from "../types/AuthTypes";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

type UserRequest = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber: string;
  email: string;
};

type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber: string;
  email: string;
};

const getUserById = async (id: string): Promise<UserResponse> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    const { data } = await baseAPIClient.get(`/users/${id}`, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return error as UserResponse;
  }
};

const updateUserById = async (
  id: string,
  {
    userData,
  }: {
    userData: UserRequest;
  },
): Promise<UserResponse> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;

  try {
    const { data } = await baseAPIClient.put(`/users/${id}`, userData, {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return error as UserResponse;
  }
};

export default { getUserById, updateUserById };
