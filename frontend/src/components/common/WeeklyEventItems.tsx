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

import { colorMap } from "../../constants/DaysInWeek";
import { Schedule } from "../../types/SchedulingTypes";
import WeeklyEventItemPopUp from "./WeeklyEventItemPopUp";

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

      <WeeklyEventItemPopUp isOpen={isOpen} onClose={onClose} onOpen={onOpen} schedule={schedule} />
    </>
  );
};

export default DefaultWeeklyEventItem;
