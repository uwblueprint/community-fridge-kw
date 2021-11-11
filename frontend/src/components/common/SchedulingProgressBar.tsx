import { Flex } from "@chakra-ui/layout";
import { Step, Steps } from "chakra-ui-steps";
import React from "react";

import customTheme from "../../theme";
import { SchedulingProgessBarProps } from "../pages/Scheduling/types";

const Button = {
  variants: {
    navigation: {
      background: "raddish.100",
      color: "squash.100",
      width: "100%",
      fontSize: "16px",
    },
    authNavigation: {
      backgroundColor: "evergreen.100",
      color: "squash.100",
      size: "lg",
      width: "100%",
    },
  },
};

const steps = [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }];
const SchedulingProgressBar = ({
  activeStep,
}: SchedulingProgessBarProps): JSX.Element => {
  return (
    <Flex flexDir="column" width="100%">
      <Steps
        activeStep={activeStep}
        responsive={false}
        colorScheme="teal"
        size="sm"
      >
        {steps.map(({ label }) => (
          <Step key={label} colorScheme="blue" />
        ))}
      </Steps>
    </Flex>
  );
};

export default SchedulingProgressBar;
