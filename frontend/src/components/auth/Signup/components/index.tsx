import { Box, Center, Text } from "@chakra-ui/react";
import React from "react";

import { CheckmarkIcon, CloseIcon } from "../../../common/icons";

export const MandatoryInputDescription = ({
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

export const isCheckMarkOrClose = (isTrue: boolean) => {
  return isTrue ? <CheckmarkIcon /> : <CloseIcon color="#DF7676" />;
};

export const PasswordRequirement = ({
  state,
  label,
}: {
  state: boolean;
  label: string;
}): JSX.Element => (
  <Center float="left">
    {isCheckMarkOrClose(state)}
    <Text pl="0.5rem">{label} </Text>
  </Center>
);
