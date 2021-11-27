import { Container, Flex } from "@chakra-ui/react";
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
    <Container px="32px" py="35px">
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
    </Container>
  );
};

export default SchedulingProgressBar;
