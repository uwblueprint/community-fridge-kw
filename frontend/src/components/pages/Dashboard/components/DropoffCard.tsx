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
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { colorMap } from "../../../../constants/DaysInWeek";
import * as Routes from "../../../../constants/Routes";
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
  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      width="100%"
      mb="24px"
      mr="24px"
      border="1px solid"
      borderColor="hubbard.100"
      borderRadius="8px"
      onClick={() => history.push(`${Routes.DASHBOARD_PAGE}/${schedule.id}`)}
    >
      <Box pl="6" pr="6" pb="6" pt="4">
        <Box spacing="0" display="flex">
          <Text
            mt="0.5rem"
            mb="16px"
            textStyle="mobileBodyBold"
            whiteSpace="nowrap"
            flexGrow={8}
          >
            {startDate}
          </Text>
          <Box marginLeft="0px">
            <Menu isLazy>
              <MenuButton
                zIndex="9999"
                style={{
                  marginLeft: "6rem",
                  marginBottom: "15px",
                  marginRight: "0px",
                }}
                as={IconButton}
                aria-label="options"
                icon={<EllipsisIcon />}
                variant="ghost"
                backgroundColor="transparent"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList p={0} minW="0" w="94px">
                <MenuItem
                  onClick={() =>
                    history.push(`${Routes.DASHBOARD_PAGE}/${schedule.id}`)
                  }
                  textStyle="mobileSmall"
                >
                  Edit
                </MenuItem>
                <MenuItem
                  textStyle="mobileSmall"
                  color="tomato.100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
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
          </Box>
        </Box>
        <HStack>
          <TimeIcon color="black.100" />
          <Text textStyle="mobileBodyBold">Time: </Text>
          <Text textStyle="mobileBody">{startTime}</Text>
        </HStack>
        <HStack>
          <StarIcon color="black.100" />
          <Text textStyle="mobileBodyBold">Volunteers Requested: </Text>
          <Text textStyle="mobileBody">
            {schedule.volunteerNeeded ? "Yes" : "No"}
          </Text>
        </HStack>
        {schedule.frequency && (
          <Badge
            borderRadius="8px"
            py="6px"
            px="14px"
            mt="16px"
            color={`${(colorMap as any)[schedule.frequency]}.100`}
            backgroundColor={`${(colorMap as any)[schedule.frequency]}.50`}
          >
            {schedule.frequency}
          </Badge>
        )}
      </Box>
    </Box>
  );
};

export default DropoffCard;
