import React from "react";
import { Button } from "@chakra-ui/react";
import { NextButtonProps } from "./types";

export default function NextButton({isBeingEdited, go, canSubmit, handleNext}: NextButtonProps) {
  return (
    <div style={{display: "flex", justifyContent: "flex-end"}}>
      {isBeingEdited ? (
        <Button
          onClick={() => go && go("confirm donation details")}
          variant="cancelNavigation"
          w={{ md: "300px" }}
        >
          Cancel
        </Button>
      ) : (
        <Button
          isDisabled={!canSubmit}
          onClick={handleNext}
          variant="navigation"
          width={{ md: "300px" }}
        >
          Next
        </Button>
      )}
    </div>
  )
}