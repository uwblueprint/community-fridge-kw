import { Container } from "@chakra-ui/react";
import React from "react";

import ViewDonations from "./ViewDonations";

const ViewDonationsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <ViewDonations isAdminView />
    </Container>
  );
};

export default ViewDonationsPage;
