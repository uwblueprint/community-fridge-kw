import { Container, Stack, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import { Status } from "../../../types/AuthTypes";
import PendingPage from "./PendingPage";
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

interface ShiftProps {
  shiftId: number | null;
  isRescue: boolean;
}

const VolunteerShiftsPage = () => {
  const [volunteerStatus, setVolunteerStatus] = useState<Status>();
  const { authenticatedUser } = useContext(AuthContext);

  const getVolunteerData = async () => {
    const volunteerResponse = await VolunteerAPIClient.getVolunteerByUserId(
      authenticatedUser!.id,
    );
    setVolunteerStatus(volunteerResponse.status);
  };

  useEffect(() => {
    getVolunteerData();
  }, []);

  const [shiftIdValue, setShiftIdValue] = useState<number>();
  const [isRescueValue, setIsRescueValue] = useState<boolean>();
  const setShiftIdValueFunction = (value: number) => {
    setShiftIdValue(value);
  };
  const setIsRescueValueFunction = (value: boolean) => {
    setIsRescueValue(value);
  };
  const { step, navigation }: UseStepType = useStep({
    steps,
    initialStep: 1,
  });
  const { id } = step;

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
          setIsRescue={setIsRescueValueFunction}
          navigation={navigation}
          setShiftId={setShiftIdValueFunction}
        />
      );
    case "confirm shift sign up":
      return (
        <Container centerContent variant="responsiveContainer">
          <p>confirm shift page component</p>
        </Container>
      );
    case "thank you page":
      return (
        <Container centerContent variant="responsiveContainer">
          <p>thank you page component</p>
        </Container>
      );
    default:
      return <></>;
  }
};

export default VolunteerShiftsPage;
