import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { NextButtonProps } from "./types";

export default function NextButton({isBeingEdited, go, canSubmit, handleNext}: NextButtonProps) {
  return (
    <Flex justify="flex-end">
      {isBeingEdited ? (
        <Button
          onClick={() => go && go("confirm donation details")}
          variant="cancelNavigation"
        >
          Cancel
        </Button>
      ) : (
        <Button
          isDisabled={!canSubmit}
          onClick={handleNext}
          variant="navigation"
        >
          Next
        </Button>
      )}
    </Flex>
  )
}
