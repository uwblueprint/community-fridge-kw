import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Routes from "../../../constants/Routes";

const FailedModal = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const history = useHistory();

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

          <ModalFooter>
            <Button
              width="100%"
              color="squash.100"
              backgroundColor="raddish.100"
              mr={3}
              onClick={() => history.push(Routes.LOGIN_PAGE)}
            >
              Return to Log In
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default FailedModal;
