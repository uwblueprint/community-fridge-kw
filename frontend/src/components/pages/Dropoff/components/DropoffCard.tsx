import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import { Badge, Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { SchedulingFormProps } from "../../Scheduling/types";

interface DropoffCardProps {
  schedule: SchedulingFormProps;
}

const DropoffCard = ({ schedule }: DropoffCardProps): JSX.Element => {
  const startDate = new Date(schedule.startTime).toDateString();
  const startTime = new Date(schedule.startTime).toLocaleTimeString();

  return (
    <Box
      maxW="sm"
      mb="24px"
      border="1px solid"
      borderColor="hubbard.100"
      borderRadius="8px"
    >
      <Box p="6">
        <Text mb="16px" textStyle="mobileBodyBold">
          {startDate}
        </Text>
        <HStack>
          <TimeIcon color="raddish.100" />
          <Text textStyle="mobileCardDescription">Time: </Text>
          <Text textStyle="mobileSmall">{startTime}</Text>
        </HStack>
        <HStack mb="16px">
          <StarIcon color="raddish.100" />
          <Text textStyle="mobileCardDescription">Volunteers Requested: </Text>
          <Text textStyle="mobileSmall">
            {schedule.volunteerNeeded ? "Yes" : "No"}
          </Text>
        </HStack>
        {schedule.frequency && (
          <Badge
            borderRadius="full"
            pt="6px"
            pb="6px"
            pl="14px"
            pr="14px"
            color="squash.100"
            backgroundColor="evergreen.100"
          >
            {schedule.frequency}
          </Badge>
        )}
      </Box>
    </Box>
  );
};

export default DropoffCard;
