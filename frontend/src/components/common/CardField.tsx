import { Text, VStack } from "@chakra-ui/react";
import React from "react";

interface CardFieldProps {
  title: string;
  value: string;
}

const CardField = ({ title, value }: CardFieldProps) => (
  <VStack align="left">
    <Text textTransform="uppercase" textStyle="mobileSmall" color="hubbard.100">
      {title}
    </Text>
    <Text textStyle="mobileSmall" pb={["1rem", "0px"]}>
      {value}
    </Text>
  </VStack>
);

export default CardField;
