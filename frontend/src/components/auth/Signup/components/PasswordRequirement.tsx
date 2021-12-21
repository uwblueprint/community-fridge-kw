import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Center, Text } from "@chakra-ui/react";
import React from "react";

const CheckMarkOrClose = (isTrue: boolean): JSX.Element => {
  return isTrue ? (
    <CheckIcon color="spinach.100" />
  ) : (
    <SmallCloseIcon color="tomato.100" />
  );
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
