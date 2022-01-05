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
  useMediaQuery,
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
        size={isDesktop ? "2xl" : "sm"}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent py="52px" px="48px">
          <ModalHeader>
            <Text textStyle={isDesktop ? "desktopHeader3" : "mobileBodyBold"}>
              Cancel Dropoff
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            Are you sure you want to cancel your dropoff? This will remove this
            occurance and notify CFKW and all the respective parties.
          </ModalBody>

          <ModalFooter>
            <Button width="100%" colorScheme="red" onClick={onDelete}>
              Cancel Dropoff
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteScheduleModal;
