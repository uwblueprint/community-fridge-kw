import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../../APIClients/DonorAPIClient";
import * as Routes from "../../../../constants/Routes";
import { CheckIn } from "../../../../types/CheckInTypes";
import { Schedule } from "../../../../types/SchedulingTypes";
import CardField from "../../../common/CardField";
import { getShiftColor, ShiftTypes } from "../../VolunteerShifts/types";

const VolunteerShiftCard = ({
  schedule,
  checkIn,
}: {
  schedule?: Schedule;
  checkIn?: CheckIn;
}): JSX.Element => {
  const {
    donorId,
    isPickup,
    pickupLocation,
    volunteerTime,
    startTime,
    notes: scheduleNotes,
  } = schedule || {};
  const { startDate, endDate, notes: checkinNotes } = checkIn || {};
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
      return format(new Date(startDate), "h:mmaa");
    }

    return volunteerTime;
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
          {businessName && (
            <CardField title="Organization Name" value={businessName} />
          )}
          <CardField title="Volunteer Request Time" value={`${timeLocal()}`} />
          {pickupLocation && (
            <CardField title="Location" value={pickupLocation} />
          )}
          <CardField
            title="Notes"
            value={checkinNotes || scheduleNotes || "-"}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default VolunteerShiftCard;
