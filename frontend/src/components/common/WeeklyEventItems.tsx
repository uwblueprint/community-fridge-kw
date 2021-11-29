import {
  Badge,
  Container,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import DonorAPIClient from "../../APIClients/DonorAPIClient";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { colorMap, convertTime } from "../../constants/DaysInWeek";
=======
import { colorMap } from "../../constants/DaysInWeek";
>>>>>>> Donor information retrieval done
=======
import { colorMap, convertTime } from "../../constants/DaysInWeek";
>>>>>>> Add icons
=======
import { colorMap, convertTime } from "../../constants/DaysInWeek";
>>>>>>> 7c55e4005da7a2a96c342db8dc0c92b2875cddfc
import { DonorResponse } from "../../types/DonorTypes";
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
<<<<<<< HEAD
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donor, setDonor] = useState<DonorResponse>();

  useEffect(() => {
    const getDonor = async () => {
      const donorResponse = await DonorAPIClient.getDonorById(
        schedule!.donorId,
      );
      setDonor(donorResponse);
    };

    getDonor();
  }, []);

<<<<<<< HEAD
  const convertTime = (dateToConvert: string): string => {
    return new Date(dateToConvert).toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
=======
>>>>>>> 7c55e4005da7a2a96c342db8dc0c92b2875cddfc

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donor, setDonor] = useState<DonorResponse>();

  useEffect(() => {
    const getDonor = async () => {
      const donorResponse = await DonorAPIClient.getDonorById(
        schedule!.donorId,
      );
      setDonor(donorResponse);
    };

    getDonor();
  }, []);

<<<<<<< HEAD
=======
>>>>>>> Add icons
  return (
    <>
<<<<<<< HEAD
=======
  return (
    <>
>>>>>>> 7c55e4005da7a2a96c342db8dc0c92b2875cddfc
      {
        donor ?
          <>
            <Container
              color="#FAFCFE"
              borderWidth="0.05rem"
              borderRadius="0.5rem"
              borderColor="#D8DDE0"
              alignItems="center"
              centerContent
              py="1.5rem"
              px="2rem"
              onClick={onOpen}
            >
              <Text textAlign="center" textStyle="desktopBodyBold" mb="0.5rem">
                {donor?.firstName} {donor?.lastName}
              </Text>
              <Text textAlign="center" textStyle="desktopSmall" mb="1rem">
                {convertTime(schedule!.startTime)} - {convertTime(schedule!.endTime)}
              </Text>
              <Badge
                color={`${(colorMap as any)[schedule!.frequency]}.100`}
                backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
                textStyle="desktopSmall"
                py="0.5rem"
                ph="1rem"
              >
                {" "}
                {schedule!.frequency}{" "}
              </Badge>
            </Container>

            <WeeklyEventItemPopUp
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              schedule={schedule}
              donor={donor as DonorResponse}
            />
          </>
          : null
<<<<<<< HEAD
=======
    {
    donor ?
      <>
        <Container
          color="#FAFCFE"
          borderWidth="0.05rem"
          borderRadius="0.5rem"
          borderColor="#D8DDE0"
          alignItems="center"
          centerContent
          py="1.5rem"
          px="2rem"
          onClick={onOpen}
        >
          <Text textAlign="center" textStyle="desktopBodyBold" mb="0.5rem">
            {donor?.firstName} {donor?.lastName}
          </Text>
          <Text textAlign="center" textStyle="desktopSmall" mb="1rem">
            {convertTime(schedule!.startTime)} - {convertTime(schedule!.endTime)}
          </Text>
          <Badge
            color={`${(colorMap as any)[schedule!.frequency]}.100`}
            backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
            textStyle="desktopSmall"
            py="0.5rem"
            ph="1rem"
          >
            {" "}
            {schedule!.frequency}{" "}
          </Badge>
        </Container>

        <WeeklyEventItemPopUp
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          schedule={schedule}
          donor={donor as DonorResponse}
        />
      </>
      : null
>>>>>>> Donor information retrieval done
=======
>>>>>>> 7c55e4005da7a2a96c342db8dc0c92b2875cddfc
      }
    </>
  );
};

export default DefaultWeeklyEventItem;
