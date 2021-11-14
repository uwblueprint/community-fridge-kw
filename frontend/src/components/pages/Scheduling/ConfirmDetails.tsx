import { Button, Container, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { SCHEDULE_THANKYOU_PAGE } from "../../../constants/Routes";
import { SchedulingStepProps } from "./types";

const ConfirmDetails = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous } = navigation;
  const history = useHistory();

  const onSubmitClick = async () => history.push(SCHEDULE_THANKYOU_PAGE);

  //   const { insert form fields for this page here } = formData;

  return (
    // Insert confirm Donation detail page here
    <Container>
      <Text textStyle="mobileHeader2"> Confirm Donation Details Page </Text>
      <HStack>
        <Button onClick={previous} variant="navigation">
          Back
        </Button>
        <Button onClick={onSubmitClick} variant="navigation">
          Submit
        </Button>
      </HStack>
    </Container>
  );
};

export default ConfirmDetails;