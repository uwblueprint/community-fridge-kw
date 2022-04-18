import React, { useContext } from "react";

import VolunteerContext from "../../../contexts/VolunteerContext";
import { Status } from "../../../types/AuthTypes";
import PendingPage from "./PendingPage";
import ScheduledVolunteerShiftsPage from "./ShiftsPage";

const VolunteerDashboard = () => {
  const { volunteerStatus } = useContext(VolunteerContext);

  return (
    <>
      {volunteerStatus === Status.APPROVED ? <ScheduledVolunteerShiftsPage /> : <PendingPage />}
    </>
  );
};

export default VolunteerDashboard;
