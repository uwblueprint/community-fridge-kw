import { Flex } from "@chakra-ui/layout";
import { Step, Steps } from "chakra-ui-steps";
import React from "react";

import { SchedulingProgessBarProps } from "../pages/Scheduling/types";

const SchedulingProgressBar = ({
  activeStep,
  totalSteps,
}: SchedulingProgessBarProps): JSX.Element => {
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    label: `${i}`,
  }));

  return (
    <Flex flexDir="column" width="100%">
      <Steps
        activeStep={activeStep}
        responsive={false}
        colorScheme="raddish"
        size="sm"
      >
        {steps.map(({ label }) => (
          <Step key={label} colorScheme="raddish" />
        ))}
      </Steps>
    </Flex>
  );
};

export default SchedulingProgressBar;
