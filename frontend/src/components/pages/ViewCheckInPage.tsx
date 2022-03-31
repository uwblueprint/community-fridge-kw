import { Container } from "@chakra-ui/react";
import React from "react";

import ViewCheckins from "./ViewDonationsAndCheckins";

const ViewDonationsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <ViewCheckins isAdminView={false} isCheckInView />
    </Container>
  );
};

export default ViewDonationsPage;
