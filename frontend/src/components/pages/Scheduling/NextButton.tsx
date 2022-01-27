import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { ButtonProps } from "./types";

export default function NextButton({ canSubmit, handleNext }: ButtonProps) {
  return (
    <Flex justify="flex-end">
      <Button isDisabled={!canSubmit} onClick={handleNext} variant="navigation">
        Next
      </Button>
    </Flex>
  );
}
