import { Container, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import { Status } from "../../../types/AuthTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import ConfirmShiftDetails from "./ConfirmShiftDetails";
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
} as unknown) as Schedule;

const VolunteerShiftsPage = (schedulingData = schedulingDefaultData) => {
  const [volunteerStatus, setVolunteerStatus] = useState<Status>();
  const { authenticatedUser } = useContext(AuthContext);
  const [schedulingFormValues, setSchedulingForm] = useForm(schedulingData);
  const [shiftId, setShiftId] = useState<string>();
  const [isFoodRescue, setIsFoodRescue] = useState<boolean>();

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
      return <VolunteerShiftsTabs navigation={navigation} setShiftId={setShiftId}
      setIsFoodRescue={setIsFoodRescue} />;
    case "confirm shift sign up":
      return <ConfirmShiftDetails navigation={navigation}/>;
    case "thank you page":
      return (
        <Container centerContent variant="responsiveContainer">
          <Text>Thank You Page Component</Text>
        </Container>
      );
    default:
      return <></>;
  }
};

export default VolunteerShiftsPage;
