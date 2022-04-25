import { Container } from "@chakra-ui/react";
import React from "react";

import ViewCheckIns from "./ViewDonationsAndCheckIns";

const ViewCheckInsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <ViewCheckIns isAdminView={false} isCheckInView />
    </Container>
  );
};

export default ViewCheckInsPage;
