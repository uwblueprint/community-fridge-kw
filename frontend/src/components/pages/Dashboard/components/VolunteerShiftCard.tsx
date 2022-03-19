import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../../APIClients/DonorAPIClient";
import * as Routes from "../../../../constants/Routes";
import { CheckIn } from "../../../../types/CheckInTypes";
import { Schedule } from "../../../../types/SchedulingTypes";
import { getShiftColor, ShiftTypes } from "../../VolunteerShifts/types";

const VolunteerShiftCard = ({
  schedule,
  checkIn,
}: {
  schedule?: Schedule;
  checkIn?: CheckIn;
}): JSX.Element => {
  const {
    id: scheduleId,
    donorId,
    isPickup,
    pickupLocation,
    volunteerTime,
    startTime,
    endTime,
  } = schedule || {};
  const { startDate, endDate, notes, id: checkInId } = checkIn || {};
  const [businessName, setBusinessName] = useState<string>("");

  const history = useHistory();

  const shiftType = () => {
    if (checkIn) {
      return ShiftTypes.CHECKIN;
    }
    return isPickup ? ShiftTypes.PICKUP : ShiftTypes.UNLOADING;
  };

  const dateLocal = () => {
    if (startDate) {
      return format(new Date(startDate), "EEE MMM dd, yyyy");
    }

    return startTime && format(new Date(startTime), "EEE MMM dd, yyyy");
  };

  const timeLocal = () => {
    if (startDate) {
      return format(new Date(startDate), "h:mm aa");
    }

    return volunteerTime;
  };

  const startTimeLocal = startTime && format(new Date(startTime), "h:mm aa");
  const endTimeLocal = endTime && format(new Date(endTime), "h:mm aa");

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
    <Box my="24px" width={{ base: "default", md: "100%" }} overflow="hidden">
      <Stack
        direction={["column", "row"]}
        display="flex"
        justify="space-between"
      >
        <Text textStyle="mobileHeader4" whiteSpace="nowrap" minWidth="225px">
          {`${dateLocal()}`}
          <Text minWidth="125px" textStyle="mobileSmall" color="hubbard.100">
            {shiftType()}
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
        bg={getShiftColor(shiftType())}
        width={{ base: "default", md: "100%" }}
        onClick={() => history.push(`${Routes.DASHBOARD_PAGE}`)}
        overflow="hidden"
      >
        <Stack
          direction={["column", "row"]}
          display={["default", "flex"]}
          spacing={["0", "4"]}
        >
          <VStack align="left">
            {businessName && (
              <>
                <Text
                  textTransform="uppercase"
                  textStyle="mobileSmall"
                  color="hubbard.100"
                >
                  Organization
                </Text>
                <Text textStyle="mobileSmall" pb={["1.5rem", "0px"]}>
                  {businessName}
                </Text>
              </>
            )}
            <Text
              textTransform="uppercase"
              textStyle="mobileSmall"
              color="hubbard.100"
            >
              Volunteer Request Time
            </Text>
            <Text textStyle="mobileSmall" pb={["1.5rem", "0px"]}>
              {`${timeLocal()}`}
            </Text>
            {startTimeLocal && (
              <>
                <Text
                  textTransform="uppercase"
                  textStyle="mobileSmall"
                  color="hubbard.100"
                >
                  Donation Time
                </Text>
                <Text textStyle="mobileSmall" pb={["1.5rem", "0px"]}>
                  {`${startTimeLocal}-${endTimeLocal}`}
                </Text>
              </>
            )}
            {pickupLocation && (
              <>
                <Text
                  textTransform="uppercase"
                  textStyle="mobileSmall"
                  color="hubbard.100"
                >
                  Location
                </Text>
                <Text textStyle="mobileSmall" pb={["1.5rem", "0px"]}>
                  {pickupLocation}
                </Text>
              </>
            )}
            {!!checkIn && (
              <>
                <Text
                  textTransform="uppercase"
                  textStyle="mobileSmall"
                  color="hubbard.100"
                >
                  Notes
                </Text>
                <Text textStyle="mobileSmall">{notes ? `${notes}` : "-"}</Text>
              </>
            )}
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default VolunteerShiftCard;
