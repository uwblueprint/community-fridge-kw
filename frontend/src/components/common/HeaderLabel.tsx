import { Text } from "@chakra-ui/react";
import React from "react";

interface HeaderLabelProps {
  text: string;
}

const HeaderLabel = ({ text }: HeaderLabelProps) => (
  <Text mt="67px" textStyle="mobileHeader1" textAlign={["inherit", "center"]}>
    {text}
  </Text>
);

export default HeaderLabel;
