import { RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import { getFrequencyColor } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import { Schedule } from "../../../types/SchedulingTypes";
import { DonationFrequency } from "../../pages/Scheduling/types";
import { FridgeIcon, PersonIcon } from "../icons";

const CalendarInfoCard = ({
  schedule,
  isAdminView = false,
}: {
  schedule: Schedule;
  isAdminView: boolean;
}): JSX.Element => {
  const {
    startTime,
    endTime,
    id,
    donorId,
    frequency,
    size,
    recurringDonationEndDate,
  } = schedule;
  const [businessName, setBusinessName] = React.useState("");
  const frequencyColorScheme = getFrequencyColor(frequency);
  const startTimeLocal = format(new Date(startTime), "h:mm aa");
  const endTimeLocal = format(new Date(endTime), "h:mm aa");
  const formattedRecurringEndDate = format(
    new Date(recurringDonationEndDate),
    "MMM d, yyyy",
  );

  const history = useHistory();

  React.useEffect(() => {
    const getDonor = async () => {
      const donorResponse = await DonorAPIClient.getDonorById(
        schedule!.donorId,
      );
      setBusinessName(donorResponse.businessName);
    };

    getDonor();
  }, [donorId]);

  return (
    <Box
      mb="24px"
      borderLeft={`7px solid ${getFrequencyColor(frequency)}`}
      boxShadow="2px 2px 12px rgba(0, 0, 0, 0.08)"
      width="100%"
      onClick={() =>
        isAdminView && history.push(`${Routes.DASHBOARD_PAGE}/${id}`)
      }
      overflow="hidden"
    >
      <Stack
        direction={["column", "row"]}
        p="6"
        display={["default", "flex"]}
        spacing={["0", "4"]}
        alignItems="center"
      >
        <Text
          textStyle="mobileHeader4"
          whiteSpace="nowrap"
          minWidth="225px"
          pb={["18px", "0px"]}
        >
          {`${startTimeLocal}-${endTimeLocal}`}
        </Text>
        <HStack minWidth="225px" pb={["12px", "0px"]}>
          <PersonIcon color={frequencyColorScheme} />
          <Text textStyle="mobileBody">{businessName}</Text>
        </HStack>
        <HStack minWidth="225px" pb={["12px", "0px"]}>
          <FridgeIcon color={frequencyColorScheme} />
          <Text textStyle="mobileBody">{`${size} Donation`}</Text>
        </HStack>
        <HStack>
          <RepeatIcon color={frequencyColorScheme} />
          <Text>
            <Box
              as="span"
              textStyle="mobileBodyBold"
              color={frequencyColorScheme}
            >
              {frequency === DonationFrequency.ONE_TIME
                ? "One Time"
                : frequency}
            </Box>
            {frequency === DonationFrequency.ONE_TIME
              ? ` Donation`
              : ` Donation ending on ${formattedRecurringEndDate}`}
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
};

export default CalendarInfoCard;
