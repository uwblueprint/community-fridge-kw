import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import { Badge, Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import React from "react";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
interface DropoffCardProps {
  startTime: string;
  endTime: string;
  volunteersRequested: number;
  recurring?: boolean;
}

const DropoffCard = ({
  startTime,
  endTime,
  volunteersRequested,
  recurring = false,
}: DropoffCardProps): JSX.Element => {
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
          {startTime}
        </Text>
        <HStack>
          <TimeIcon color="raddish.100" />
          <Text textStyle="mobileCardDescription">Time: </Text>
          <Text>{startTime}</Text>
        </HStack>
        <HStack mb="16px">
          <StarIcon color="raddish.100"/>
          <Text textStyle="mobileCardDescription">Volunteers Requested: </Text>
          <Text>{volunteersRequested > 0 ? "Yes" : "No"}</Text>
        </HStack>
        {recurring && (
          <Badge
            borderRadius="full"
            pt="6px"
            pb="6px"
            pl="14px"
            pr="14px"
            color="squash.100"
            backgroundColor="evergreen.100"
          >
            Weekly on {days[new Date(startTime).getDay()]}
          </Badge>
        )}
      </Box>
    </Box>
  );
};

export default DropoffCard;
