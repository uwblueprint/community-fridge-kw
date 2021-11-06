import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { SchedulingFormProps } from "./types";

const GetStarted = ({
  formValues,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
  setForm: SetForm;
}) => {
  const { next } = navigation;
  const history = useHistory();

  return (
    // Insert Get Started page here
    <Container>
      This is Get Started page
      <Button
        mt="2"
        backgroundColor="black.100"
        color="white.100"
        size="md"
        w="100%"
        onClick={next}
      >
        Get started!
      </Button>
    </Container>
  );
};

export default GetStarted;
