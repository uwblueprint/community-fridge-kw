import {
  Badge,
  Container,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import DonorAPIClient from "../../APIClients/DonorAPIClient";
import { colorMap, convertTime } from "../../constants/DaysInWeek";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donor, setDonor] = useState<DonorResponse>();

  useEffect(() => {
    const getDonor = async () => {
      const donorResponse = await DonorAPIClient.getDonorById(
        schedule!.donorId,
      );
      console.log(donorResponse);
      setDonor(donorResponse);
    };

    getDonor();
  }, []);

  return (
    <>
    {
    donor ?
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
            {donor?.firstName} {donor?.lastName}
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

        <WeeklyEventItemPopUp
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          schedule={schedule}
          donor={donor as DonorResponse}
        />
      </>
      : null
      }
    </>
  );
};

export default DefaultWeeklyEventItem;
