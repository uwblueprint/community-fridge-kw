import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Badge,
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
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { colorMap, convertTime } from "../../../constants/DaysInWeek";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";

type WeeklyEventItemPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  donor: DonorResponse;
};

const WeeklyEventItemPopUp = ({
  isOpen,
  onClose,
  schedule,
  donor,
}: WeeklyEventItemPopUpProps) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [nextDropOff, setNextDropOff] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getNextDropOff = async () => {
      const scheduleResponse = await SchedulingAPIClient.getScheduleByDonorId(
        donor.id,
      );
      setNextDropOff(
        scheduleResponse.find((nextSchedule) => {
          return (
            new Date(nextSchedule!.startTime) > new Date(schedule!.startTime)
          );
        })?.startTime,
      );
    };

    getNextDropOff();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxW="90%"
          width="fit-content"
          maxH="fit-content"
          height="fit-content"
        >
          <ModalHeader>
            <Text
              textStyle={isMobile ? "mobileHeader3" : "desktopSubtitle"}
              pl={isMobile ? "1.125rem" : "6rem"}
              pt={isMobile ? "2rem" : "4rem"}
            >
              Donation Details
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <Divider orientation="horizontal" />
          <ModalBody>
            <VStack
              alignItems="start"
              pl={isMobile ? "0.125rem" : "5rem"}
              pt="2.5rem"
            >
              <Flex width="100%" pl="1rem">
                <VStack alignItems="start">
                  <Text
                    textStyle={isMobile ? "mobileBodyBold" : "desktopBodyBold"}
                    py="0.5rem"
                  >
                    {donor.businessName
                      ? donor.businessName
                      : `${donor.firstName} ${donor.lastName}`}
                  </Text>
                  <HStack py="0.5rem">
                    <CalendarIcon />
                    <Text textStyle={isMobile ? "mobileSmall" : "desktopSmall"}>
                      {new Date(schedule!.startTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </HStack>
                  <HStack py="0.5rem">
                    <TimeIcon />
                    <Text textStyle={isMobile ? "mobileSmall" : "desktopSmall"}>
                      {convertTime(schedule!.startTime)} -{" "}
                      {convertTime(schedule!.endTime)}
                    </Text>
                  </HStack>
                  {nextDropOff && (
                    <Text
                      textStyle={isMobile ? "mobileSmall" : "desktopSmall"}
                      py="0.5rem"
                    >
                      Next Dropoff:{" "}
                      {new Date(nextDropOff).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  )}
                  {isMobile && (
                    <Badge
                      color={`${(colorMap as any)[schedule!.frequency]}.100`}
                      backgroundColor={`${
                        (colorMap as any)[schedule!.frequency]
                      }.200`}
                      borderRadius="0.5rem"
                      textStyle={isMobile ? "mobileSmall" : "desktopSmall"}
                      textAlign="center"
                      alignItems="center"
                      pt="0.5rem"
                      mr="6rem"
                      width="5.5rem"
                      height="2rem"
                    >
                      {`${schedule!.frequency}`}
                    </Badge>
                  )}
                </VStack>
                <Spacer />
                {!isMobile && (
                  <Badge
                    color={`${(colorMap as any)[schedule!.frequency]}.100`}
                    backgroundColor={`${
                      (colorMap as any)[schedule!.frequency]
                    }.200`}
                    borderRadius="0.5rem"
                    textStyle={isMobile ? "mobileSmall" : "desktopSmall"}
                    textAlign="center"
                    alignItems="center"
                    pt="0.5rem"
                    mr="6rem"
                    width="5.5rem"
                    height="2rem"
                  >
                    {`${schedule!.frequency}`}
                  </Badge>
                )}
              </Flex>
              <Divider orientation="horizontal" />
              <Container pt="1.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="hubbard.100"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  DONATION INFORMATION
                </Text>
                <Grid
                  templateColumns={isMobile ? "auto" : "repeat(2, 1fr)"}
                  gap={isMobile ? "0.5rem" : "1rem"}
                >
                  <Text textStyle="popupTitleText">Size:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {schedule?.size}
                  </Text>
                  <Text textStyle="popupTitleText">Category of Item:</Text>
                  <Text textStyle="popupInformationText">
                    {schedule?.categories.join(", ")}
                  </Text>
                </Grid>
              </Container>

              <Container pt="2.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="hubbard.100"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  VOLUNTEER INFORMATION
                </Text>
                <Grid
                  templateColumns={isMobile ? "auto" : "repeat(2, 1fr)"}
                  gap={isMobile ? "0.5rem" : "1rem"}
                >
                  <Text textStyle="popupTitleText">Volunteer Required:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {schedule?.volunteerNeeded ? "Yes" : "No"}
                  </Text>
                  <Text textStyle="popupTitleText">Pickup Required:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {schedule?.isPickup ? "Yes" : "No"}
                  </Text>
                  <Text textStyle="popupTitleText">Address:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {schedule?.pickupLocation}
                  </Text>
                  <Text textStyle="popupTitleText">Additional notes:</Text>
                  <Text textStyle="popupInformationText">
                    {schedule?.notes}
                  </Text>
                </Grid>
              </Container>
              <Container pt="2.5rem">
                <Text
                  textStyle="mobileCardDescription"
                  color="hubbard.100"
                  verticalAlign="top"
                  textAlign="left"
                  pb="2rem"
                >
                  DONOR INFORMATION
                </Text>
                <Grid
                  templateColumns={isMobile ? "auto" : "repeat(2, 1fr)"}
                  gap={isMobile ? "0.5rem" : "1rem"}
                >
                  <Text textStyle="popupTitleText">Name:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {donor.firstName} {donor.lastName}
                  </Text>
                  <Text textStyle="popupTitleText">Email:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {donor.email}
                  </Text>
                  <Text textStyle="popupTitleText">Phone:</Text>
                  <Text
                    textStyle="popupInformationText"
                    pb={isMobile ? "1.5rem" : "0rem"}
                  >
                    {donor.phoneNumber}
                  </Text>
                  <Text textStyle="popupTitleText">Organizations:</Text>
                  <Text textStyle="popupInformationText">
                    {donor.businessName}
                  </Text>
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
