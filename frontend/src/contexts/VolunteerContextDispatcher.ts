import { createContext, Dispatch } from "react";

import { VolunteerContextAction } from "../types/VolunteerTypes";

const VolunteerDispatcherContext = createContext<
  Dispatch<VolunteerContextAction>
>(() => {});

export default VolunteerDispatcherContext;
