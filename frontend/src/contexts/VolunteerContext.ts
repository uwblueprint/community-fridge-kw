import { createContext } from "react";

import { Status } from "../types/AuthTypes";

type VolunteerContextType = {
  volunteerId: string | null;
  volunteerStatus: Status | null;
};

const VolunteerContext = createContext<VolunteerContextType>({
  volunteerId: null,
  volunteerStatus: null,
});

export default VolunteerContext;
