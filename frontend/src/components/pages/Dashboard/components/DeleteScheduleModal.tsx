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

import useViewport from "../../../../hooks/useViewport";

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
  const { isDesktop } = useViewport();

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
              Cancel One-Time Donation
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            Are you sure you want to cancel your donation? This will remove all linked occurances and notify the donor.
          </ModalBody>
          <ModalFooter>
            <Button width="100%" colorScheme="red" onClick={onDelete}>
              Cancel Donation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteScheduleModal;
