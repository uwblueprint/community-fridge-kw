import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { SchedulingFormProps } from "./types";

const DonationInformation = ({
  formValues,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formValues: SchedulingFormProps;
  setForm: SetForm;
}) => {
  const { previous, next } = navigation;
  const history = useHistory();
  //   const { insert form fields for this page here } = formData;

  return (
    // Insert Select Date and Time page here
    <Container>
      This is Donation Information page
      <Button onClick={previous}>Back</Button>
      <Button onClick={next}>Next</Button>
    </Container>
  );
};

export default DonationInformation;
