import { Button, Container } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import { SCHEDULE_THANKYOU_PAGE } from "../../../constants/Routes";
import { SchedulingFormProps } from "./types";

const ConfirmDetails = ({
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

  const onSubmitClick = async () =>  history.push(SCHEDULE_THANKYOU_PAGE);

  //   const { insert form fields for this page here } = formData;

  return (
    // Insert confirm Donation detail page here
    <Container>
      This is Confirm Donation Details page
      <Button
        mt="2"
        backgroundColor="black.100"
        color="white.100"
        size="md"
        w="100%"
        onClick={onSubmitClick}
      >
        Submit
      </Button>
    </Container>
  );
};

export default ConfirmDetails;
