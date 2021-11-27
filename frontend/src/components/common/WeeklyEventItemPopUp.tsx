import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxW="55rem"
          width="55rem"
          maxH="65rem"
          height="65rem"
        >
          <ModalHeader>
            <Text textStyle="desktopSubtitle" pl="6rem" pt="4rem">
              Donation Details 
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <Divider orientation="horizontal"/>
          <ModalBody>
            <VStack alignItems="start" pl="5rem" pt="2.5rem">
              <Flex width="100%" pl="1rem">
                  <VStack alignItems="start">
                    <Text textStyle="desktopBodyBold" py="0.5rem">{donor.businessName ? donor.businessName : `${donor.firstName} ${donor.lastName}`}</Text>
                    <HStack py="0.5rem">
                      <CalendarIcon/>
                      <Text textStyle="desktopSmall">
                        {new Date(schedule!.startTime).toLocaleString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </HStack>
                    <HStack py="0.5rem">
                      <TimeIcon />
                      <Text textStyle="desktopSmall">{convertTime(schedule!.startTime)} - {convertTime(schedule!.endTime)}</Text>
                    </HStack>
                    {
                      getNextDropOff(schedule!.startTime, schedule!.frequency) ?
                          <Text textStyle="desktopSmall" py="0.5rem">{getNextDropOff(schedule!.startTime, schedule!.frequency)}</Text>
                        : null
                    }
                  </VStack>
                <Spacer/>
                <Badge
                  color={`${(colorMap as any)[schedule!.frequency]}.100`}
                  backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
                  textStyle="desktopSmall"
                  textAlign="center"
                  alignItems="center"
                  pt="0.5rem"
                  mr="6rem"
                  width="5.5rem"
                  height="2rem"
                >
                  {" "}
                  {schedule!.frequency}{" "}
                </Badge>
              </Flex>
              <Divider orientation="horizontal" />
              <Container pt="1.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  DONATION INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap="1rem">
                  <Text textStyle="popupTitleText">Size:</Text>
                  <Text textStyle="popupInformationText">{schedule?.size}</Text>
                  <Text textStyle="popupTitleText">Category of Item:</Text>
                  <Text textStyle="popupInformationText">{schedule?.categories.join(", ")}</Text>
                </Grid>
              </Container>
              <Container pt="2.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  VOLUNTEER INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap="1rem">
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
              <Container pt="2.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="#6C6C84"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  DONOR INFORMATION
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap="1rem" pb="5rem">
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
