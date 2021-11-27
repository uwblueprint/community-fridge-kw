import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
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

import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import React from "react";

import { colorMap, convertTime, getNextDropOff } from "../../constants/DaysInWeek";
import { DonorResponse } from "../../types/DonorTypes";
import { Schedule } from "../../types/SchedulingTypes";

type WeeklyEventItemPopUpProps = {
  isOpen: any;
  onOpen: any;
  onClose: any;
  schedule: Schedule;
  donor: DonorResponse;
};

const WeeklyEventItemPopUp = ({
  isOpen,
  onOpen,
  onClose,
  schedule,
  donor,
}: WeeklyEventItemPopUpProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent maxW="full" height={{ md: "60rem", base: "60rem" }}>
          <ModalHeader>Donation Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Container>
                <Flex>
                    <VStack>
                      <Text textStyle="desktopBodyBold">{donor.businessName}</Text>
                      <HStack>
                        <CalendarIcon pr="16px"/>
                        <Text textStyle="popupInformationText">
                          {new Date(schedule!.startTime).toLocaleString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </HStack>
                      <HStack>
                        <TimeIcon pr="16px"/>
                        <Text textStyle="popupInformationText">{convertTime(schedule!.startTime)} - {convertTime(schedule!.endTime)}</Text>
                      </HStack>
                      <Text textStyle="popupInformationText">{getNextDropOff(schedule!.startTime, schedule!.frequency)}</Text>
                    </VStack>
                  <Spacer/>
                  <Badge
                    color={`${(colorMap as any)[schedule!.frequency]}.100`}
                    backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
                    textStyle="desktopSmall"
                    py="6px"
                    ph="14px"
                    width="5rem"
                    height="2rem"
                  >
                    {" "}
                    {schedule!.frequency}{" "}
                  </Badge>
                </Flex>
              </Container>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  py="16px"
                >
                  DONATION INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Text textStyle="popupTitleText">Size:</Text>
                  <Text textStyle="popupInformationText">{schedule?.size}</Text>
                  <Text textStyle="popupTitleText">Category of Item:</Text>
                  <Text textStyle="popupInformationText">{schedule?.categories.join(", ")}</Text>
                </Grid>
              </Container>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  py="16px"
                >
                  VOLUNTEER INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Text textStyle="popupTitleText">Volunteer Required:</Text>
                  <Text textStyle="popupInformationText">{schedule?.volunteerNeeded ? "Yes" : "No"}</Text>
                  <Text textStyle="popupTitleText">Pickup Required:</Text>
                  <Text textStyle="popupInformationText">{schedule?.isPickup ? "Yes" : "No"}</Text>
                  <Text textStyle="popupTitleText">Address:</Text>
                  <Text textStyle="popupInformationText">{schedule?.pickupLocation}</Text>
                  <Text textStyle="popupTitleText">Additional notes:</Text>
                  <Text textStyle="popupInformationText">{schedule?.notes}</Text>
                </Grid>
              </Container>
              <Container>
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  py="16px"
                >
                  DONOR INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Text textStyle="popupTitleText">Name:</Text>
                  <Text textStyle="popupInformationText">
                    {donor.firstName} {donor.lastName}
                  </Text>
                  <Text textStyle="popupTitleText">Email:</Text>
                  <Text textStyle="popupInformationText">{donor.email}</Text>
                  <Text textStyle="popupTitleText">Phone:</Text>
                  <Text textStyle="popupInformationText">{donor.phoneNumber}</Text>
                  <Text textStyle="popupTitleText">Organizations:</Text>
                  <Text textStyle="popupInformationText">{donor.businessName}</Text>
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
