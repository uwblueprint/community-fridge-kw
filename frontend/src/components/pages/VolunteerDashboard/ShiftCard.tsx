import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import * as Routes from "../../../constants/Routes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import CardSubInformation from "../../common/Card";
import { getShiftColor } from "./types";

interface CheckInOrScheduleProps {
  id: string;
  donorId?: string;
  isPickup?: boolean;
  pickupLocation?: string;
  volunteerTime?: string;
  startTime?: string;
  startDate?: string;
  endDate?: string;
  notes: string;
  type: ShiftType;
}
const VolunteerShiftCard = ({
  shift,
  navigation,
  isSignUp,
  setSelectedVolunteerShift,
}: {
  shift: CheckInWithShiftType | ScheduleWithShiftType;
  navigation?: NavigationProps;
  isSignUp?: boolean;
  setSelectedVolunteerShift?: (
    shift: ScheduleWithShiftType | CheckInWithShiftType,
  ) => void;
}): JSX.Element => {
  const history = useHistory();
  const {
    id,
    donorId,
    isPickup,
    pickupLocation,
    volunteerTime,
    startTime,
    startDate,
    endDate,
    notes,
    type,
  } = shift as CheckInOrScheduleProps;
  const [businessName, setBusinessName] = useState<string>("");
  let next: () => void;

  if (navigation) {
    next = navigation.next;
  }

  const dateLocal = () => {
    if (startDate) {
      return format(new Date(startDate), "EEE MMM dd, yyyy");
    }
    return startTime && format(new Date(startTime), "EEE MMM dd, yyyy");
  };

  const timeLocal = () => {
    if (startDate) {
      return (
        endDate &&
        `${format(new Date(startDate), "h:mma")}-${format(
          new Date(endDate),
          "h:mma",
        )}`
      );
    }

    return (
      volunteerTime &&
      format(parse(volunteerTime, "HH:mm", new Date()), "h:mma")
    );
  };

  const onSubmitClick = async () => {
    if (isSignUp && setSelectedVolunteerShift) {
      setSelectedVolunteerShift(shift);
      next();
    } else {
      history.push(`${Routes.VOLUNTEER_SHIFTS_PAGE}/${id}/${shift.type}`);
    }
  };

  useEffect(() => {
    const getBusinessName = async () => {
      if (donorId) {
        const donor = await DonorAPIClient.getDonorById(donorId);
        setBusinessName(donor.businessName);
      }
    };
    getBusinessName();
  }, []);

  return (
    <Box my="2rem" width="100%" overflow="hidden">
      <Stack
        direction={["column", "row"]}
        display="flex"
        justify="space-between"
      >
        <Text textStyle="mobileHeader4" minWidth="225px">
          {`${dateLocal()}`}
          <Text
            minWidth="125px"
            textStyle="mobileSmall"
            color="hubbard.100"
            pb={["0.5rem", "0rem"]}
          >
            {type === ShiftType.CHECKIN && "Fridge check-in"}
            {type === ShiftType.SCHEDULING &&
              (isPickup ? "Food rescue pickup" : "Food rescue unloading")}
          </Text>
        </Text>
        <Button
          float="right"
          mt="1.5rem"
          size="md"
          width={isSignUp ? ["100%", "15%"] : ["100%", "15%"]}
          variant={isSignUp ? "navigation" : "outlined"}
          onClick={onSubmitClick}
        >
          {isSignUp ? "Volunteer for shift" : "View details"}
        </Button>
      </Stack>
      <Box
        mt="1.5rem"
        mr={{ base: "0px", md: "24px" }}
        p="2rem"
        borderRadius="8px"
        bg={getShiftColor(type, !!isPickup)}
        width={{ base: "default", md: "100%" }}
        overflow="hidden"
      >
        <Stack
          direction={["column", "row"]}
          display={["default", "flex"]}
          spacing={["0", "8"]}
        >
          {businessName && (
            <CardSubInformation
              description="Organization"
              value={businessName}
            />
          )}
          <CardSubInformation
            description="Volunteer Arrival Time"
            value={`${timeLocal()}`}
          />
          {pickupLocation && (
            <CardSubInformation description="Location" value={pickupLocation} />
          )}
          <CardSubInformation description="Notes" value={notes || "-"} />
        </Stack>
      </Box>
    </Box>
  );
};

export default VolunteerShiftCard;
