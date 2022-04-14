import { Container } from "@chakra-ui/react";
import React from "react";

import EditCheckInDescription from "./EditCheckInOrFoodRescueDescription";

const EditCheckInDescriptionPage = () => {
  return (
    <Container variant="responsiveContainer">
      <EditCheckInDescription isCheckInView />
    </Container>
  );
};

export default EditCheckInDescriptionPage;
