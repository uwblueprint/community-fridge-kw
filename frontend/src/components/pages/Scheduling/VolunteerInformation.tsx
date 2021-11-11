import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const VolunteerInformation = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const history = useHistory();
  //   const { insert form fields for this page here } = formData;

  return (
    // Insert Volunteer Information page here
    <Container>
      <SchedulingProgressBar activeStep={3} />
      <Text textStyle="mobileHeader2">Volunteer Information Page</Text>
      <HStack>
        <Button onClick={previous} variant="navigation">
          Back
        </Button>
        <Button onClick={next} variant="navigation">
          Next
        </Button>
      </HStack>
    </Container>
  );
};

export default VolunteerInformation;
