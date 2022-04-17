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
      <Box as='span' color="tomato.100">
      {" "}*
      </Box>
    </Text>

  </Box>
);

export default MandatoryInputDescription;
