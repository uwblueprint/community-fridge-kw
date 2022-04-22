import { BEARER_TOKEN } from "../constants/AuthConstants";
import { Role } from "../types/AuthTypes";
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
  try {
    const { data } = await baseAPIClient.get(`/users/${id}`, {
      headers: { Authorization: BEARER_TOKEN },
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
  try {
    const { data } = await baseAPIClient.put(`/users/${id}`, userData, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as UserResponse;
  }
};

const deleteUserById = async (id: string): Promise<boolean> => {
  try {
    await baseAPIClient.delete(`/users?userId=${id}`, {
      headers: { Authorization: BEARER_TOKEN },
    });
    console.log("TIRAMISU: Client received success")
    return true;
  } catch (error) {
    console.log("TIRAMISU: Client received error")
    return false;
  }
};

export default { getUserById, updateUserById, deleteUserById };
