import { Container } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Status } from "../../../types/AuthTypes";
import PendingPage from "./PendingPage";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import AuthContext from "../../../contexts/AuthContext";

const VolunteerShiftsPage = () => {
  const [volunteerStatus, setVolunteerStatus] = useState<Status>();
  const { authenticatedUser } = useContext(AuthContext);
  
  const getVolunteerData = async () => {
    const volunteerResponse = await VolunteerAPIClient.getVolunteerByUserId(authenticatedUser!.id);
    setVolunteerStatus(volunteerResponse.status);
  };

  useEffect(() => {
    getVolunteerData();
  }, []);

  return (
    <Container centerContent variant="responsiveContainer">
      {volunteerStatus === Status.PENDING && <PendingPage />}
    </Container>
  );
};

export default VolunteerShiftsPage;
