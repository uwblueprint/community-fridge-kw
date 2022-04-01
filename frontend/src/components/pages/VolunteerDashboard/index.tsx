import { Container } from "@chakra-ui/react";
import React, { useContext } from "react";

import VolunteerContext from "../../../contexts/VolunteerContext";
import { Status } from "../../../types/AuthTypes";
import PendingPage from "./PendingPage";
import ScheduledVolunteerShiftsPage from "./ShiftsPage";

const VolunteerDashboard = () => {
  const { volunteerStatus } = useContext(VolunteerContext);

  return (
    <Container centerContent variant="responsiveContainer">
      {volunteerStatus === Status.PENDING && <PendingPage />}
      {volunteerStatus === Status.APPROVED && <ScheduledVolunteerShiftsPage />}
    </Container>
  );
};

export default VolunteerDashboard;
