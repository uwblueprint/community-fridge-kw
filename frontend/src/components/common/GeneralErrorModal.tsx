import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface GeneralErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  bodyText: string;
}
const GeneralErrorModal = ({
  isOpen,
  onClose,
  headerText,
  bodyText,
}: GeneralErrorModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb="20px">
        <ModalHeader>{headerText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody textStyle="mobileBody">{bodyText}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GeneralErrorModal;
