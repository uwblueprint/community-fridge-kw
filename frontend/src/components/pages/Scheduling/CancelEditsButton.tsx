import { Button, CloseButton, Flex } from "@chakra-ui/react";
import React from "react";
import { ButtonProps } from "./types";

export default function CancelButton({ go }: ButtonProps) {
  return (
    <Flex justify="flex-end" mt="2em">
        <CloseButton 
            onClick={() => go && go("confirm donation details")}
            variant="cancelNavigation" 
            size="lg"
        />
    </Flex>
  );
}
