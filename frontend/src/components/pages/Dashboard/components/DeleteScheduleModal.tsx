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

interface DeleteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}
const DeleteScheduleModal = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteScheduleModalProps) => {
  return (
    <>
      <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text textStyle="mobileBodyBold">Cancel Dropoff</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            Are you sure you want to cancel this scheduled donation?
            <br />
            Doing so will alert CF admin and all associated parties that this
            donation dropoff is cancelled.
          </ModalBody>

          <ModalFooter>
            <Button width="100%" colorScheme="red" onClick={onDelete}>
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteScheduleModal;
