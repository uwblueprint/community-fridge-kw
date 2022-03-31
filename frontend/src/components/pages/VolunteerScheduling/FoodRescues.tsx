import { Text } from "@chakra-ui/react";
import React from "react";

const FoodRescues = (): JSX.Element => {
  return (
    <>
      <Text pt="0.8rem" textStyle="mobileHeader4" color="black.100">
        Food rescue shifts{" "}
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody" color="hubbard.100">
        Food rescue shifts are picking up food from donors and helping bring
        them to the fridge.{" "}
      </Text>
    </>
  );
};

export default FoodRescues;
