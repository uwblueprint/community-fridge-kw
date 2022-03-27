import { Button, Container, HStack, Img, Text } from "@chakra-ui/react";
import { format } from "date-fns";
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
    <Container variant="responsiveContainer">
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        mt="2em"
      >
        Thank you for scheduling a donation!
      </Text>
      <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
        We appreciate your support and dedication! An email confirmation has
        been sent to {authenticatedUser!.email}.
      </Text>
      <Text
        textStyle="mobileHeader4"
        mt="2em"
        color="hubbard.100"
        fontWeight="bold"
      >
        See you at the fridge on{" "}
        {format(new Date(startTime), "eeee MMMM d, yyyy")} at{" "}
        {format(new Date(startTime), "h:mm aa")}!
      </Text>
      <Img
        src={ThankYouPageFridge}
        alt="Community Fridge Thank You Page"
        mt="2em"
        mb="3em"
        width="100%"
        maxWidth="600px"
      />
      <HStack>
        <Button
          onClick={() => history.push(Routes.DASHBOARD_PAGE)}
          variant="navigation"
          w="100%"
          maxWidth="500px"
          size="lg"
        >
          View dashboard
        </Button>
      </HStack>
    </Container>
  );
};

export default ThankYou;
