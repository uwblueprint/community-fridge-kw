import { Box, Text } from "@chakra-ui/react";
import React from "react";

const MandatoryInputDescription = ({
  label,
}: {
  label: string;
}): JSX.Element => (
  <Box display="inline">
    <Text
      display="inline-block"
      textStyle="secondarySubheading"
      color="gray.300"
    >
      {label}
    </Text>{" "}
    <Text
      textStyle="secondarySubheading"
      display="inline-block"
      color="red.100"
    >
      *
    </Text>
  </Box>
);

export default MandatoryInputDescription;
