import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import React from "react";

import { ButtonProps } from "./types";

export default function BackButton({ previous }: ButtonProps) {
  return (
    <Box mt={10}>
      <Button onClick={previous} paddingLeft="0" backgroundColor="transparent">
        <ArrowBackIcon w={8} h={5} /> Back
      </Button>
    </Box>
  );
}
