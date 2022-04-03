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
  <VStack align="left">
    <Text textTransform="uppercase" textStyle="mobileSmall" color="hubbard.100">
      {description}
    </Text>
    <Text textStyle="mobileSmall" pb={["1.2rem", "0px"]}>
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
