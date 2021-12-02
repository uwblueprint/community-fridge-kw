import {
  Badge,
  Box,
  Center,
  Container,
  Text,
  useDisclosure,
  useMediaQuery,
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
  const [isMobile] = useMediaQuery("(max-width: 768px)");
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

  return (
    <>
      {donor && (
        <>
          <Box
            color="#FAFCFE"
            borderWidth="0.05rem"
            borderRadius="0.5rem"
            borderColor="#D8DDE0"
            alignItems="center"
            py={isMobile ? "1.25rem" : "1.5rem"}
            px={isMobile ? "0.5rem" : "2rem"}
            onClick={onOpen}
          >
            <Text textAlign="center" textStyle="desktopBodyBold" mb="0.5rem">
              {donor?.firstName} {donor?.lastName}
            </Text>
            <Text textAlign="center" textStyle="desktopSmall" mb="1rem">
              {convertTime(schedule!.startTime)} -{" "}
              {convertTime(schedule!.endTime)}
            </Text>
            <Center>
              <Badge
                color={`${(colorMap as any)[schedule!.frequency]}.100`}
                backgroundColor={`${(colorMap as any)[schedule!.frequency]}.200`}
                textStyle="desktopSmall"
                py="0.5rem"
                ph="1rem"
              >
                Frequency
                {/* {""} */}
                {/* {schedule!.frequency}{" "} */}
              </Badge>
            </Center>
          </Box>

          <WeeklyEventItemPopUp
            isOpen={isOpen}
            onClose={onClose}
            schedule={schedule}
            donor={donor as DonorResponse}
          />
        </>
      )}
    </>
  );
};

export default DefaultWeeklyEventItem;
