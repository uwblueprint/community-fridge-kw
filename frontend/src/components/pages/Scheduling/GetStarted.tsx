import { Button, Container, Text } from "@chakra-ui/react";
import React from "react";

import { SchedulingStepProps } from "./types";

const GetStarted = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { next } = navigation;

  return (
    // Insert Get Started page here
    <Container>
      <Text textStyle="mobileHeader2">This is Get Started page</Text>
      <Button onClick={next} variant="navigation">
        Get started
      </Button>
    </Container>
  );
};

export default GetStarted;
