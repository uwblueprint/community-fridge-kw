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

import useViewport from "../../../hooks/useViewport";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  discardChanges: () => void;
}
const EditAccountModal = ({
  isOpen,
  onClose,
  discardChanges,
}: EditAccountModalProps) => {
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
        <ModalContent p="1.3em">
          <ModalCloseButton />
          <ModalHeader>
            <Text textStyle={{ base: "mobileBodyBold", md: "desktopHeader3" }}>
              Are you sure you want to leave the page?
            </Text>
          </ModalHeader>
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            Any changes made to account information will not be saved.
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              size="lg"
              variant="navigation"
              onClick={discardChanges}
            >
              Discard changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAccountModal;
