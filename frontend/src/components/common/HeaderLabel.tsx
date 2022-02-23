import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface HeaderLabelProps {
  text: string;
  isDesktop: boolean;
}
const HeaderLabel = ({ text, isDesktop }: HeaderLabelProps) => {
  if (isDesktop) {
    return (
      <Box textAlign="center">
        <Text mt="67px" textStyle="mobileHeader1">
          {text}
        </Text>
      </Box>
    );
  }
  return (
    <Text mt="67px" textStyle="mobileHeader1">
      {text}
    </Text>
  );
};

export default HeaderLabel;
