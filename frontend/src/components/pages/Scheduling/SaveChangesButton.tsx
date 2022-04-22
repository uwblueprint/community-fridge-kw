import { Button, Flex } from "@chakra-ui/react";
import React from "react";

import useViewport from "../../../hooks/useViewport";
import { ButtonProps } from "./types";

export default function SaveButton({ onSaveClick }: ButtonProps) {
  const { isDesktop } = useViewport();

  return (
    <>
      {isDesktop ? (
        <Flex justify="flex-start">
          <Button
            onClick={onSaveClick}
            variant="navigation"
            w={{ lg: "16%", base: "100%" }}
          >
            Save changes
          </Button>
        </Flex>
      ) : (
        <Flex justifyContent="center">
          <Button onClick={onSaveClick} variant="navigation">
            Save changes
          </Button>
        </Flex>
      )}
    </>
  );
}
