import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";
import * as Routes from "../../../constants/Routes";
import DonorAPIClient from "../../../APIClients/DonorAPIClient";
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
        <Text textStyle="mobileHeader4" whiteSpace="nowrap" minWidth="225px">
          {`${dateLocal()}`}
          <Text minWidth="125px" textStyle="mobileSmall" color="hubbard.100">
            {type === ShiftType.CHECKIN && "Fridge check-in"}
            {type === ShiftType.SCHEDULING &&
              (isPickup ? "Pickup assistance" : "Unloading assistance")}
          </Text>
        </Text>
        <Button
          float="right"
          mt="1.5rem"
          size="lg"
          width={isSignUp ? ["55%", "32%"] : ["50%", "20%"]}
          variant={isSignUp ? "navigation" : "viewDetails"}
          onClick={onSubmitClick}
        >
          {isSignUp ? "Volunteer for shift" : "View Details"}
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
