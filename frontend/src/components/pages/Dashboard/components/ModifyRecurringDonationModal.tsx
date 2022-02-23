import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

import useViewport from "../../../../hooks/useViewport";

interface ModifyRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModification: (isOneTimeEvent?: boolean) => void;
  modificationType: string;
  isRecurringDisabled?: boolean;
}
const ModifyRecurringModal = ({
  isOpen,
  onClose,
  onModification,
  modificationType,
  isRecurringDisabled = false,
}: ModifyRecurringModalProps) => {
  const { isDesktop } = useViewport();
  const [modifyScheduleValue, setmodifyScheduleValue] = useState("one");

  return (
    <>
      <Modal
        size={isDesktop ? "2xl" : "xs"}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent py="52px" px="48px">
          <ModalHeader>
            <Text textStyle={isDesktop ? "desktopHeader3" : "mobileBodyBold"}>
              {modificationType[0].toUpperCase() + modificationType.slice(1)}{" "}
              Donation
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            <RadioGroup
              onChange={setmodifyScheduleValue}
              value={modifyScheduleValue}
            >
              <Stack>
                <Radio size="lg" colorScheme="red" value="one">
                  This donation
                </Radio>
                <Radio
                  size="lg"
                  colorScheme="red"
                  value="all"
                  isDisabled={isRecurringDisabled}
                >
                  This and all following donations
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              colorScheme="red"
              onClick={() => onModification(modifyScheduleValue === "one")}
            >
              {modificationType[0].toUpperCase() + modificationType.slice(1)}{" "}
              donation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModifyRecurringModal;
