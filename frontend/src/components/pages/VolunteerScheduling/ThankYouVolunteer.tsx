import { Button, Container, HStack, Img, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import ThankYouPageFridge from "../../../assets/ThankYouPageFridge.png";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";

const schedulingDefaultData = ({
  id: "",
  donorId: "",
  categories: [],
  size: "",
  dayPart: "",
  startTime: "",
  endTime: "",
  frequency: "",
  notes: "",
  volunteerTime: "",
} as unknown) as Schedule;

const ThankYouVolunteer = ({
  shiftId,
  isFoodRescue,
}: {
  shiftId: string;
  isFoodRescue: boolean;
}) => {
  const [currentFoodRescue, setCurrentFoodRescue] = useState<Schedule>(
    schedulingDefaultData,
  );
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckIn>({} as CheckIn);

  const getFoodRescueData = async () => {
    const foodRescueResponse = await SchedulingAPIClient.getScheduleById(
      shiftId,
    );

    setCurrentFoodRescue(foodRescueResponse);
  };
  const getCheckInData = async () => {
    const checkInResponse = await CheckInAPIClient.getCheckInsById(shiftId);
    setCurrentCheckIn(checkInResponse);
  };

  useEffect(() => {
    if (isFoodRescue) {
      getFoodRescueData();
    } else {
      getCheckInData();
    }
  }, [shiftId, isFoodRescue]);

  const { authenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  return (
    <Container variant="responsiveContainer">
      <Text
        textStyle={{ base: "mobileHeader2", md: "desktopHeader2" }}
        mt="2em"
      >
        Thank you for volunteering with CFKW!
      </Text>
      {isFoodRescue && (
        <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
          {`We can't wait to see you at the fridge on ${
            currentFoodRescue.startTime
              ? format(
                  new Date(currentFoodRescue.startTime),
                  "eeee MMMM d, yyyy",
                )
              : ""
          } at
        ${
          currentFoodRescue.volunteerTime
            ? format(
                parse(currentFoodRescue.volunteerTime, "kk:mm", new Date()),
                "h:mm a",
              )
            : ""
        } `}
        </Text>
      )}
      {!isFoodRescue && (
        <Text textStyle="mobileBody" mt="1em" color="hubbard.100">
          {`We can't wait to see you at the fridge on ${
            currentCheckIn.startDate
              ? format(new Date(currentCheckIn.startDate), "eeee MMMM d, yyyy")
              : ""
          } at
        ${
          currentCheckIn.startDate
            ? format(new Date(currentCheckIn.startDate), "h:mm aa")
            : ""
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
      />
      <HStack>
        <Button
          onClick={() => history.push(Routes.VOLUNTEER_DASHBOARD_PAGE)}
          variant="navigation"
          w="100%"
          maxWidth="500px"
          size="lg"
        >
          Finish
        </Button>
      </HStack>
    </Container>
  );
};

export default ThankYouVolunteer;
