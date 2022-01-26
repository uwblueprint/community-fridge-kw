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
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";


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
      <ModalContent>
        <ModalHeader>Sign up failed</ModalHeader>
        <ModalCloseButton />
        <ModalBody textStyle="mobileBody">
          Sorry, something went wrong. Please try again later and check all
          fields have correct formatting.
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ErrorSchedulingModal;
