import { CloseButton, Flex } from "@chakra-ui/react";
import React from "react";

import { ButtonProps } from "./types";

export default function CancelButton({ discardChanges }: ButtonProps) {
  return (
    <Flex justify="flex-end" mt="2em">
      <CloseButton
        onClick={discardChanges}
        variant="cancelNavigation"
        size="lg"
      />
    </Flex>
  );
}
