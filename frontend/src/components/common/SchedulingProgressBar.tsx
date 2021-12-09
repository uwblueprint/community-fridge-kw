import { Container, Flex, useMediaQuery } from "@chakra-ui/react";
import { Step, Steps } from "chakra-ui-steps";
import React from "react";

import { SchedulingProgessBarProps } from "../pages/Scheduling/types";

const labels = [
  "Date and time",
  "Donation information",
  "Volunteer information",
  "Confirm",
];

const SchedulingProgressBar = ({
  activeStep,
  totalSteps,
}: SchedulingProgessBarProps): JSX.Element => {
  const [isDesktop] = useMediaQuery("(min-width: 48em)");

  return (
    <>
      <Flex flexDir="column" width="100%">
        <Steps
          activeStep={activeStep}
          responsive={false}
          colorScheme="raddish"
          size="sm"
        >
          {[...Array(totalSteps)].map((e, i) => {
            return isDesktop ? (
              <Step key={i} label={labels[i]} colorScheme="raddish" />
            ) : (
              <Step key={i} colorScheme="raddish" />
            );
          })}
        </Steps>
      </Flex>
    </>
  );
};

export default SchedulingProgressBar;
