import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface DonationStepProps {
  title: string;
  description: string;
  stepNumber: number;
}
const DonationStep = ({
  title,
  description,
  stepNumber,
}: DonationStepProps): JSX.Element => {
  return (
    <Flex paddingBottom="1.5rem">
      <Text textStyle="body" flex="1">
        {stepNumber}
      </Text>
      <Box flex="10">
        <Text color="gray.200" textStyle="subHeading">
          {title}
        </Text>
        <Text textStyle="caption">{description}</Text>
      </Box>
    </Flex>
  );
};

const DonationProcess = () => {
  return (
    <Container mt="57px">
      <Text color="gray.200" textStyle="subHeading" mb="1rem">
        For Donors
      </Text>
      <Text mb="1.5rem" color="black.100" textStyle="heading">
        THE DONATION PROCESS
      </Text>
      <DonationStep
        stepNumber={1}
        title="Create an account"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
      />
      <DonationStep
        stepNumber={2}
        title="Schedule a dropoff"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
      />
      <DonationStep
        stepNumber={3}
        title="Complete your donation"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
      />
      <Button width="90%" variant="outline" backgroundColor="white.100">
        Start now
      </Button>
    </Container>
  );
};

export default DonationProcess;
