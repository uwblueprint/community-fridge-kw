import { Button, Container, HStack, Img, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import ThankYouPageFridge from "../../../assets/ThankYouPageFridge.png";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";

const ThankYouVolunteer = ({
  shift,
}: {
  shift: ScheduleWithShiftType | CheckInWithShiftType;
}) => {
  const { authenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  return (
    <Container variant="responsiveContainer" textAlign="center">
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        mt="2em"
      >
        Thank you for volunteering with CFKW!
      </Text>
      {shift.type === ShiftType.SCHEDULING && (
        <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
          {`We can't wait to see you at the fridge on ${
            shift.startTime
              ? format(new Date(shift.startTime), "eeee MMMM d, yyyy")
              : ""
          } at
        ${
          shift.volunteerTime
            ? format(parse(shift.volunteerTime, "HH:mm", new Date()), "h:mm a")
            : ""
        } `}
        </Text>
      )}
      {shift.type === ShiftType.CHECKIN && (
        <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
          {`We can't wait to see you at the fridge on ${
            shift.startDate
              ? format(new Date(shift.startDate), "eeee MMMM d, yyyy")
              : ""
          } at
        ${
          shift.startDate ? format(new Date(shift.startDate), "h:mm aa") : ""
        } `}
        </Text>
      )}

      <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
        We appreciate your support and dedication! An email confirmation has
        been sent to {authenticatedUser!.email}.
      </Text>

      <Img
        src={ThankYouPageFridge}
        alt="Community Fridge Thank You Page"
        mt="2em"
        mb="3em"
        width="100%"
        maxWidth="600px"
        display="block"
        ml="auto"
        mr="auto"
      />
      <HStack mr="auto" ml="auto" display="block">
        <Button
          onClick={() => history.push(Routes.VOLUNTEER_DASHBOARD_PAGE)}
          variant="navigation"
          w="100%"
          maxWidth="500px"
          size="md"
        >
          Finish
        </Button>
      </HStack>
    </Container>
  );
};

export default ThankYouVolunteer;
