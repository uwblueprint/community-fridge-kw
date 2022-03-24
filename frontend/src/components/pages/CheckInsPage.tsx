import { Container, Text } from "@chakra-ui/react";
import React from "react";
import ViewCheckIns from "./ViewCheckIns";

const CheckInsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <ViewCheckIns isAdminView />
    </Container>
  );
};

export default CheckInsPage;
