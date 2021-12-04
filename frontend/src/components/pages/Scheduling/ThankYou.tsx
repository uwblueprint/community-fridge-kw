import { Button, Container, HStack, Img, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import ThankYouPageFridge from "../../../assets/ThankYouPageFridge.png";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { SchedulingStepProps } from "./types";

const ThankYou = ({ formValues }: SchedulingStepProps) => {
  const { startTime } = formValues;
  const { authenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  return (
    <Container p="30px">
      <Text textStyle="mobileHeader2" mt="2em">
        Thank you for scheduling a donation!
      </Text>
      <Text textStyle="mobileHeader4" mt="2em">
        See you at the fridge on {new Date(startTime).toDateString()} at{" "}
        {new Date(startTime).toLocaleTimeString()}!
      </Text>
      <Text textStyle="mobileBody" mt="2em">
        We really appreciate your support. Your donation will help feed someone
        who needs the food. We have sent you an email confirmation to{" "}
        {authenticatedUser!.email}.
      </Text>
      <Img
        src={ThankYouPageFridge}
        alt="Community Fridge Thank You Page"
        marginBottom="50px"
        width="100%"
      />
      <HStack>
        <Button
          onClick={() => history.push(Routes.DASHBOARD_PAGE)}
          variant="navigation"
          w="100%"
        >
          View Dashboard
        </Button>
      </HStack>
    </Container>
  );
};

export default ThankYou;
