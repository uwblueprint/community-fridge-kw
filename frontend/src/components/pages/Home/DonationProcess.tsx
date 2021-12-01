import { Box, Button, Flex, Text } from "@chakra-ui/react";
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
      <Text
        width="22px"
        height="22px"
        borderRadius="50%"
        backgroundColor="cottonCandy.100"
        textStyle="mobileSmall"
        flex="1"
        color="poison.100"
        textAlign="center"
        marginRight="11px"
        marginTop="4px"
      >
        {stepNumber}
      </Text>
      <Box flex="10">
        <Text color="black.100" textStyle="mobileHeader4">
          {title}
        </Text>
        <Text textStyle="mobileSmall">{description}</Text>
      </Box>
    </Flex>
  );
};

const DonationProcess = (): JSX.Element => {
  return (
    <Box mt="57px">
      <Text color="hubbard.100" textStyle="mobilePretitleBold" mb="1rem">
        For Donors
      </Text>
      <Text mb="1.5rem" color="black.100" textStyle="mobileHeader2">
        The Donation Process
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
      <Button width="100%" variant="navigation">
        Start now
      </Button>
    </Box>
  );
};

export default DonationProcess;
