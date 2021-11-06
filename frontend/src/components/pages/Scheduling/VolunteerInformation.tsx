import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { SchedulingFormProps } from "./types";

const VolunteerInformation = ({
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
  //   const { insert form fields for this page here } = formData;

  return (
    // Insert Volunteer Information page here
    <Container>
      This is Volunteer Information page
      <Button
        mt="2"
        backgroundColor="black.100"
        color="white.100"
        size="md"
        w="100%"
        onClick={next}
      >
        Next
      </Button>
    </Container>
  );
};

export default VolunteerInformation;
