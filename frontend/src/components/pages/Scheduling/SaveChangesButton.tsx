import { Button, Flex } from "@chakra-ui/react";
import React from "react";

import useViewport from "../../../hooks/useViewport";
import { ButtonProps } from "./types";

export default function SaveButton({ onSaveClick }: ButtonProps) {
  const { isDesktop } = useViewport();

  return (
    <>
      {isDesktop ? (
        <Flex justify="flex-end">
          <Button onClick={onSaveClick} variant="navigation">
            Save Changes
          </Button>
        </Flex>
      ) : (
        <Flex justifyContent="center">
          <Button onClick={onSaveClick} variant="navigation">
            Save Changes
          </Button>
        </Flex>
      )}
    </>
  );
}
