import { Circle, Flex } from "@chakra-ui/layout";
import { Step, Steps } from "chakra-ui-steps";
import React from "react";
import { JsxEmit } from "typescript";

import { SchedulingProgessBarProps } from "../pages/Scheduling/types";

const CircleIcon = (): JSX.Element => {
  return <Circle width="28px" height="28px" backgroundColor="evergreen.100" />;
};

const BlankCircleIcon = () => {
  return <Circle width="28px" height="28px" backgroundColor="water.100" />;
};

const SchedulingProgressBar = ({
  activeStep,
  totalSteps,
}: SchedulingProgessBarProps): JSX.Element => {
  const steps = [];

  for (let i = 0; i < totalSteps; i += 1) {
    steps.push({ label: i.toString() });
  }

  return (
    <Flex flexDir="column" width="100%">
      <Steps
        activeStep={activeStep.stepNumber}
        responsive={false}
        colorScheme="evergreen.100"
        size="sm"
        checkIcon={CircleIcon}
      >
        {steps.map(({ label }) => (
          <Step
            key={label}
            colorScheme="evergreen.100"
            isCompletedStep={label === activeStep.label}
            icon={BlankCircleIcon}
          />
        ))}
      </Steps>
    </Flex>
  );
};

export default SchedulingProgressBar;
