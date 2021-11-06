import { Button, Container } from "@chakra-ui/react";
import React from "react";

const ThankYou = () => {
  return (
    // Insert thank you page here
    <Container>
      This is thank you page
      <Button
        mt="2"
        backgroundColor="black.100"
        color="white.100"
        size="md"
        w="100%"
        // onClick={next}
      >
        View Dashboard
      </Button>
    </Container>
  );
};

export default ThankYou;
