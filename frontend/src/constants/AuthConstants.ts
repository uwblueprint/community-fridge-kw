import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

export const AUTHENTICATED_USER_KEY = `${window.location.hostname}:AUTHENTICATED_USER`;
export const AUTHENTICATED_VOLUNTEER_CONTEXT_KEY = `${window.location.hostname}:AUTHENTICATED_VOLUNTEER_CONTEXT`;

export const BEARER_TOKEN = `Bearer ${getLocalStorageObjProperty(
  AUTHENTICATED_USER_KEY,
  "accessToken",
)}`;

export enum SignupErrorMessage {
  HEADER = "Sign up failed",
  BODY = "Sorry, something went wrong. Please try again later and check all fields have correct formatting.",
}
