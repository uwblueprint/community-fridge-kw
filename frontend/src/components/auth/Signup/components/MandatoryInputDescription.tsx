import { Box, Text } from "@chakra-ui/react";
import React from "react";

const MandatoryInputDescription = ({
  label,
}: {
  label: string;
}): JSX.Element => (
  <Box display="inline">
    <Text display="inline-block" textStyle="mobileBody" color="black.100">
      {label}
    </Text>{" "}
    <Text textStyle="mobileBody" display="inline-block" color="tomato.100">
      *
    </Text>
  </Box>
);

export default MandatoryInputDescription;
