import { Flex } from "@chakra-ui/layout";
import { Step, Steps } from "chakra-ui-steps";
import React from "react";

import { SchedulingProgessBarProps } from "../pages/Scheduling/types";

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
