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
import { DateObject } from "react-multi-date-picker";

import useViewport from "../../../../hooks/useViewport";

interface DeleteShiftModalProps {
  dateRange: DateObject[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}
const DeleteShiftModal = ({
  dateRange,
  isOpen,
  onClose,
  onDelete,
}: DeleteShiftModalProps) => {
  const { isDesktop } = useViewport();

  return (
    <>
      <Modal
        size={["xs, "2xl"]}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent py="52px" px="48px">
          <ModalHeader>
            <Text textStyle={isDesktop ? "desktopHeader3" : "mobileBodyBold"}>
              Cancel shifts in range
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          {dateRange[0] && dateRange[1] && (
            <ModalBody textStyle="mobileBody" color="hubbard.100">
              Are you sure you want to cancel these fridge check-in shifts? This
              will remove all shifts
              {dateRange[0].toString() === dateRange[1].toString()
                ? ` on ${dateRange[0].format("MMMM D").toString()} `
                : ` between ${dateRange[0]
                    .format("MMMM D")
                    .toString()} and ${dateRange[1]
                    .format("MMMM D")
                    .toString()} `}
              and notify any assigned volunteers.
            </ModalBody>
          )}
          <ModalFooter>
            <Button width="100%" colorScheme="red" onClick={onDelete}>
              Cancel shifts
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteShiftModal;
