import { Container, Text } from "@chakra-ui/react";
import React from "react";

const CheckInsPage = () => {
  return (
    <Container variant="responsiveContainer">
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        textAlign="center"
        mt="2em"
      >
        Fridge check-ins
      </Text>
    </Container>
  );
};

export default CheckInsPage;
