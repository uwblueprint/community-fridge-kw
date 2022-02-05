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
  type: "cancel" | "error" | "";
}
const EditAccountModal = ({
  isOpen,
  onClose,
  discardChanges,
  type,
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
          {type === "cancel" ? <ModalCloseButton /> : null}
          <ModalHeader>
            <Text textStyle={{ base: "mobileBodyBold", md: "desktopHeader3" }}>
              {type === "cancel"
                ? "Are you sure you want to leave the page?"
                : "Edit information failed"}
            </Text>
          </ModalHeader>
          <ModalBody textStyle="mobileBody" color="hubbard.100">
            {type === "cancel"
              ? "Any changes made to account information will not be saved."
              : "Something went wrong. Please try again."}
          </ModalBody>
          <ModalFooter>
            <Button
              width="100%"
              size="lg"
              variant="navigation"
              onClick={discardChanges}
            >
              {type === "cancel" ? "Discard changes" : "OK"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAccountModal;
