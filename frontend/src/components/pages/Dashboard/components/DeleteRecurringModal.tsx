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

interface DeleteRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (isRecurrring?: boolean) => void;
}
const DeleteRecurringModal = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteRecurringModalProps) => {
  const { isDesktop } = useViewport();
  const [radioValue, setRadioValue] = useState("this");

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
              Cancel Recurring Donation
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            <RadioGroup onChange={setRadioValue} value={radioValue}>
              <Stack>
                <Radio size="lg" colorScheme="red" value="this">
                  This donation
                </Radio>
                <Radio size="lg" colorScheme="red" value="all">
                  This and all following donations
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              colorScheme="red"
              onClick={() => onDelete(radioValue === "all")}
            >
              Cancel Donation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteRecurringModal;
