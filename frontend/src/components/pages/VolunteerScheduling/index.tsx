import { Container, Stack, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import { Status } from "../../../types/AuthTypes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
} from "../../../types/VolunteerTypes";
import PendingPage from "../VolunteerDashboard/PendingPage";
import ConfirmShiftDetails from "./ConfirmShiftDetails";
import ThankYouVolunteer from "./ThankYouVolunteer";
import VolunteerShiftsTabs from "./VolunteerShiftTabs";

const steps = [
  {
    id: "pending page",
  },
  {
    id: "shifts tab",
  },
  {
    id: "confirm shift sign up",
  },
  {
    id: "thank you page",
  },
];

interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

const shiftDefaultData = ({
  id: "",
  donorId: "",
  isPickup: "",
  pickupLocation: "",
  volunteerTime: "",
  categories: [],
  size: "",
  dayPart: "",
  startTime: "",
  endTime: "",
  notes: "",
  type: "",
} as unknown) as CheckInWithShiftType | ScheduleWithShiftType;

const VolunteerScheduling = (shiftData = shiftDefaultData) => {
  const [volunteerStatus, setVolunteerStatus] = useState<Status>();
  const { authenticatedUser } = useContext(AuthContext);
  const [shiftFormValues, setShiftForm] = useForm(shiftData);
  const [shiftId, setShiftId] = useState<string>("1");
  const [isFoodRescue, setIsFoodRescue] = useState<boolean>(true);

  const getVolunteerData = async () => {
    const volunteerResponse = await VolunteerAPIClient.getVolunteerByUserId(
      authenticatedUser!.id,
    );
    setVolunteerStatus(volunteerResponse.status);
  };

  const { step, navigation }: UseStepType = useStep({
    steps,
    initialStep: 1,
  });
  const { id } = step;

  useEffect(() => {
    getVolunteerData();
  }, []);

  switch (id) {
    case "pending page":
      return (
        <Container variant="baseContainer">
          <Stack direction={["column", "row"]} justifyContent="space-between">
            <VStack alignItems="left">
              {volunteerStatus === Status.PENDING && <PendingPage />}
            </VStack>
          </Stack>
        </Container>
      );
    case "shifts tab":
      return (
        <VolunteerShiftsTabs
          navigation={navigation}
          setShiftId={setShiftId}
          setIsFoodRescue={setIsFoodRescue}
        />
      );
    case "confirm shift sign up":
      return (
        <ConfirmShiftDetails
          navigation={navigation}
          shiftId={shiftId}
          isFoodRescue={isFoodRescue}
        />
      );
    case "thank you page":
      return (
        <ThankYouVolunteer
          navigation={navigation}
          shiftId={shiftId}
          isFoodRescue={isFoodRescue}
        />
      );
    default:
      return <></>;
  }
};

export default VolunteerScheduling;
