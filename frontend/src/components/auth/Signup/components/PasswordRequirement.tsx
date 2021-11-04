import { Center, Text } from "@chakra-ui/react";
import React from "react";

import { CheckmarkIcon, CloseIcon } from "../../../common/icons";

const CheckMarkOrClose = (isTrue: boolean): JSX.Element => {
  return isTrue ? <CheckmarkIcon /> : <CloseIcon color="#DF7676" />;
};

const PasswordRequirement = ({
  state,
  label,
}: {
  state: boolean;
  label: string;
}): JSX.Element => (
  <Center float="left">
    {CheckMarkOrClose(state)}
    <Text pl="0.5rem">{label} </Text>
  </Center>
);

export default PasswordRequirement;
