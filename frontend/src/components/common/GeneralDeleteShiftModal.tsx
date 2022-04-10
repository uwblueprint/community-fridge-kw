import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface GeneralDeleteShiftModalProps {
  title: string;
  bodyText: string;
  buttonLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}
const GeneralDeleteShiftModal = ({
  title,
  bodyText,
  buttonLabel,
  isOpen,
  onClose,
  onDelete,
}: GeneralDeleteShiftModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent py="52px" px="48px" size={["xs", "2xl"]}>
        <ModalHeader>
          <Text textStyle={["mobileBodyBold", "desktopHeader3"]}>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textStyle="mobileBody" color="hubbard.100">
          {bodyText}
        </ModalBody>
        <ModalFooter>
          <Button width="100%" colorScheme="red" onClick={onDelete}>
            {buttonLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralDeleteShiftModal;
