import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

export const AUTHENTICATED_USER_KEY = `${window.location.hostname}:AUTHENTICATED_USER`;
export const AUTHENTICATED_VOLUNTEER_CONTEXT_KEY = `${window.location.hostname}:AUTHENTICATED_VOLUNTEER_CONTEXT`;

export const BEARER_TOKEN = `Bearer ${getLocalStorageObjProperty(
  AUTHENTICATED_USER_KEY,
  "accessToken",
)}`;
