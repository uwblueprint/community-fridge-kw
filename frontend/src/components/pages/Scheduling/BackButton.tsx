import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import React from "react";

import { BackButtonProps } from "./types";

export default function BackButton({
  isBeingEdited,
  onSaveClick,
  previous,
}: BackButtonProps) {
  return (
    <Box mt={10}>
      {isBeingEdited ? (
        <Button onClick={onSaveClick} variant="navigation">
          Save Changes
        </Button>
      ) : (
        <Button
          onClick={previous}
          paddingLeft="0"
          backgroundColor="transparent"
        >
          <ArrowBackIcon w={8} h={5} /> Back
        </Button>
      )}
    </Box>
  );
}
