import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Schedule } from "../../types/SchedulingTypes";

type WeeklyEventItemPopUpProps = {
  isOpen: any;
  onOpen: any;
  onClose: any;
  schedule: Schedule;
};

const WeeklyEventItemPopUp = ({
  isOpen,
  onOpen,
  onClose,
  schedule,
}: WeeklyEventItemPopUpProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent maxW="full" height={{ md: "100rem", base: "100rem" }}>
          <ModalHeader>Donation Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                >
                  DONATION INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Text>Size:</Text>
                  <Text>{schedule?.size}</Text>
                  <Text>Category of Item:</Text>
                  <Text>{schedule?.categories.join(", ")}</Text>
                </Grid>
              </Container>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                >
                  VOLUNTEER INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Text>Volunteer Required:</Text>
                  <Text>{schedule?.volunteerNeeded ? "Yes" : "No"}</Text>
                  <Text>Pickup Required:</Text>
                  <Text>{schedule?.isPickup ? "Yes" : "No"}</Text>
                  <Text>Address:</Text>
                  <Text>{schedule?.pickupLocation}</Text>
                  <Text>Additional notes:</Text>
                  <Text>{schedule?.notes}</Text>
                </Grid>
              </Container>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                >
                  DONOR INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Text>Name:</Text>
                  <Text>Yes</Text>
                  <Text>Email:</Text>
                  <Text>Yes</Text>
                  <Text>Phone:</Text>
                  <Text>Yes</Text>
                  <Text>Organization:</Text>
                  <Text>Yes</Text>
                </Grid>
              </Container>
            </VStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default WeeklyEventItemPopUp;
