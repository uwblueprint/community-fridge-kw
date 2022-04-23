import { Button, Flex } from "@chakra-ui/react";
import React from "react";

import { ButtonProps } from "./types";

export default function NextButton({ canSubmit, handleNext }: ButtonProps) {
  return (
    <Flex justify="flex-start">
      <Button
        isDisabled={!canSubmit}
        onClick={handleNext}
        w={{ lg: "18%", base: "100%" }}
        variant="navigation"
      >
        Next
      </Button>
    </Flex>
  );
}
