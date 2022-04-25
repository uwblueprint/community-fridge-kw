import { Text, VStack } from "@chakra-ui/react";
import React from "react";

const CardSubInformation = ({
  description,
  value,
  isFrequencyBlock,
  frequencyColorScheme,
}: {
  description: string;
  value: string;
  isFrequencyBlock?: boolean;
  frequencyColorScheme?: string;
}) => (
  <VStack align="left">
    <Text textTransform="uppercase" textStyle="mobileSmall" color="hubbard.100">
      {description}
    </Text>
    <Text
      textStyle="mobileSmall"
      pb={["1.2rem", "0px"]}
      color={isFrequencyBlock ? frequencyColorScheme : "black.100"}
      fontWeight={isFrequencyBlock ? "700" : "500"}
    >
      {value}
    </Text>
  </VStack>
);

export default CardSubInformation;
