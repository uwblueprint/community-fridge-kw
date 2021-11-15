import { StarIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import SchedulingAPIClient from "../../../../APIClients/SchedulingAPIClient";
import { EllipsisIcon } from "../../../common/icons";
import { SchedulingFormProps } from "../../Scheduling/types";
import DeleteScheduleModal from "./DeleteScheduleModal";

interface DropoffCardProps {
  schedule: SchedulingFormProps;
  onDelete: () => void;
}

const DropoffCard = ({ schedule, onDelete }: DropoffCardProps): JSX.Element => {
  const startDate = new Date(schedule.startTime).toDateString();
  const startTime = new Date(schedule.startTime).toLocaleTimeString();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      maxW="sm"
      mb="24px"
      border="1px solid"
      borderColor="hubbard.100"
      borderRadius="8px"
    >
      <Box p="6">
        <HStack spacing="112">
          <Text mb="16px" textStyle="mobileBodyBold">
            {startDate}
          </Text>
          <Menu isLazy>
            <MenuButton
              as={IconButton}
              aria-label="options"
              icon={<EllipsisIcon />}
              variant="ghost"
            />
            <MenuList p={0} minW="0" w="94px">
              <MenuItem
                onClick={() => console.log("edit!")}
                textStyle="mobileSmall"
              >
                Edit
              </MenuItem>
              <MenuItem
                textStyle="mobileSmall"
                color="tomato.100"
                onClick={onOpen}
              >
                Cancel
              </MenuItem>
            </MenuList>
          </Menu>
          <DeleteScheduleModal
            isOpen={isOpen}
            onClose={onClose}
            onDelete={() => {
              onDelete();
              onClose();
            }}
          />
        </HStack>
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
