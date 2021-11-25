import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

import { colorMap } from "../../constants/DaysInWeek";
import { Schedule } from "../../types/SchedulingTypes";

type DefaultWeeklyEventItemProps = {
  schedule: Schedule;
  date: string;
};

const DefaultWeeklyEventItem = ({
  schedule,
  date,
}: DefaultWeeklyEventItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const convertTime = (dateToConvert: string): string => {
    return new Date(dateToConvert).toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Container
        color="#FAFCFE"
        borderWidth="1px"
        borderRadius="8px"
        borderColor="#D8DDE0"
        alignItems="center"
        centerContent
        py="24px"
        px="30px"
        onClick={onOpen}
      >
        <Text textAlign="center" textStyle="desktopBodyBold" mb="8px">
          {schedule?.donorId}
        </Text>
        <Text textAlign="center" textStyle="desktopSmall" mb="16px">
          {convertTime(schedule!.startTime)} - {convertTime(schedule!.endTime)}
        </Text>
        <Badge
          color={`${(colorMap as any)[schedule!.frequency]}.100`}
          backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
          textStyle="desktopSmall"
          py="6px"
          ph="14px"
        >
          {" "}
          {schedule!.frequency}{" "}
        </Badge>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Donation Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>here</ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default DefaultWeeklyEventItem;
