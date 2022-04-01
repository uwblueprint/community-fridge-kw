import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { DonationFrequency } from "../../pages/Scheduling/types";

const CardSubInformation = ({
  description,
  value,
  isFrequencyBlock,
  frequency,
  frequencyColorScheme,
}: {
  description: string;
  value: string;
  isFrequencyBlock?: boolean;
  frequency?: string;
  frequencyColorScheme?: string;
}) => (
  <VStack spacing="4px" alignItems="left" minWidth="10vw">
    <Text textTransform="uppercase" color="hubbard.100" textStyle="mobileSmall">
      {description}
    </Text>
    <Text color="black.100" textStyle="desktopBody">
      {isFrequencyBlock && (
        <Box as="span" textStyle="mobileBodyBold" color={frequencyColorScheme}>
          {frequency === DonationFrequency.ONE_TIME ? "One time" : frequency}
        </Box>
      )}
      {value}
    </Text>
  </VStack>
);

export default CardSubInformation;
