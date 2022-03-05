import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface ErrorSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ErrorSchedulingModal = ({
  isOpen,
  onClose,
}: ErrorSchedulingModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent pb="20px">
        <ModalHeader>Donation could not be scheduled</ModalHeader>
        <ModalCloseButton />
        <ModalBody textStyle="mobileBody">
          Sorry, something went wrong with our system. Please try again.
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ErrorSchedulingModal;