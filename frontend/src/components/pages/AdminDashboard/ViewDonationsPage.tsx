import { Container } from "@chakra-ui/react";
import React from "react";

import ViewDonationsAndCheckins from "./ViewDonationsAndCheckins";

const ViewDonationsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <ViewDonationsAndCheckins isAdminView />
    </Container>
  );
};

export default ViewDonationsPage;
