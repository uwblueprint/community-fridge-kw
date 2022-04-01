import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import * as Routes from "../../../constants/Routes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import CardField from "../../common/CardField";
import { getShiftColor } from "./types";

interface CheckInOrScheduleProps {
  donorId?: string;
  isPickup?: boolean;
  pickupLocation?: string;
  volunteerTime?: string;
  startTime?: string;
  startDate?: string;
  notes: string;
  type: ShiftType;
}
const VolunteerShiftCard = ({
  shift,
}: {
  shift: CheckInWithShiftType | ScheduleWithShiftType;
}): JSX.Element => {
  const {
    donorId,
    isPickup,
    pickupLocation,
    volunteerTime,
    startTime,
    startDate,
    notes,
    type,
  } = shift as CheckInOrScheduleProps;
  const [businessName, setBusinessName] = useState<string>("");

  const history = useHistory();

  const dateLocal = () => {
    if (startDate) {
      return format(new Date(startDate), "EEE MMM dd, yyyy");
    }
    return startTime && format(new Date(startTime), "EEE MMM dd, yyyy");
  };

  const timeLocal = () => {
    if (startDate) {
      return format(new Date(startDate), "h:mma");
    }

    return (
      volunteerTime &&
      format(parse(volunteerTime, "kk:mm", new Date()), "h:mma")
    );
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
    <Box my="24px" width="100%" overflow="hidden">
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
          width="35%"
          variant="viewDetails"
          onClick={() => history.push(Routes.SCHEDULING_PAGE)}
        >
          View Details
        </Button>
      </Stack>
      <Box
        mt="1.5rem"
        mr={{ base: "0px", md: "24px" }}
        p="2rem"
        borderRadius="8px"
        bg={getShiftColor(type, !!isPickup)}
        width={{ base: "default", md: "100%" }}
        onClick={() => history.push(`${Routes.DASHBOARD_PAGE}`)}
        overflow="hidden"
      >
        <Stack
          direction={["column", "row"]}
          display={["default", "flex"]}
          spacing={["0", "4"]}
        >
          {businessName && (
            <CardField title="Organization Name" value={businessName} />
          )}
          <CardField title="Volunteer Arrival Time" value={`${timeLocal()}`} />
          {pickupLocation && (
            <CardField title="Location" value={pickupLocation} />
          )}
          <CardField title="Notes" value={notes || "-"} />
        </Stack>
      </Box>
    </Box>
  );
};

export default VolunteerShiftCard;
