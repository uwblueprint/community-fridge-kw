import { createContext } from "react";
import { Status } from "../types/AuthTypes";
import { VolunteerContextType } from "../types/VolunteerTypes";

export const DEFAULT_VOLUNTEER_CONTEXT = {
    volunteerId: null,
    volunteerStatus: Status.PENDING,
}

const VolunteerContext = createContext<VolunteerContextType>(DEFAULT_VOLUNTEER_CONTEXT);

export default VolunteerContext;
