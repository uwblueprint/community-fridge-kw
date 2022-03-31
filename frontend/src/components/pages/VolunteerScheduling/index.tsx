import { Container, Text } from "@chakra-ui/react";
import React from "react";
import { NavigationProps, Step, useStep } from "react-hooks-helper";
import VolunteerShiftsTabs from "./VolunteerShiftTabs";

const steps = [
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

const VolunteerScheduling = () => {
  const { step }: UseStepType = useStep({
    steps,
    initialStep: 0,
  });
  const { id } = step;

  switch (id) {
    case "shifts tab":
      return <VolunteerShiftsTabs />;
    case "confirm shift sign up":
      return (
        <Container centerContent variant="responsiveContainer">
          <Text>Confirm Shift Page Component</Text>
        </Container>
      );
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

export default VolunteerScheduling;
