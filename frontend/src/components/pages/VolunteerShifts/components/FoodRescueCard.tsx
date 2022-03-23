import { CheckIcon, CloseIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { format, isToday, isTomorrow } from "date-fns";
import React from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";
import { NavigationTimingPolyfillEntry } from "web-vitals";

import { getFrequencyColor } from "../../../../constants/DaysInWeek";
import * as Routes from "../../../../constants/Routes";
import { Schedule } from "../../../../types/SchedulingTypes";
import { DonationFrequency } from "../../Scheduling/types";

const FoodRescueCard = ({
  schedule,
  navigation,
  setShiftId,
}: {
  schedule: Schedule;
  navigation: NavigationProps;
  setShiftId: any;
}): JSX.Element => {
  const {
    startTime,
    endTime,
    id,
    frequency,
    volunteerNeeded,
    recurringDonationEndDate,
  } = schedule;
  const frequencyColorScheme = getFrequencyColor(frequency);
  const startDateLocal = new Date(startTime);
  const startTimeLocal = format(new Date(startTime), "h:mm aa");
  const endTimeLocal = format(new Date(endTime), "h:mm aa");
  const formattedRecurringEndDate = format(
    new Date(recurringDonationEndDate),
    "MMM d, yyyy",
  );

  const dateHeadingText = (startDate: Date) => {
    if (isToday(startDate)) {
      return "Today";
    }
    if (isTomorrow(startDate)) {
      return "Tomorrow";
    }
    return format(startDate, "MMM d, yyyy");
  };

  const history = useHistory();
  const { next } = navigation;
  const onClick = async () => {
    setShiftId(schedule.id);
    next();
  };

  // () => history.push(`${Routes.DASHBOARD_PAGE}/${id}`)

  return (
    <Box
      mb="24px"
      mr={{ base: "0px", md: "24px" }}
      borderLeft={`7px solid ${getFrequencyColor(frequency)}`}
      boxShadow="2px 2px 12px rgba(0, 0, 0, 0.08)"
      width={{ base: "default", md: "100%" }}
      onClick={onClick}
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
          minWidth="125px"
          textTransform="uppercase"
          textStyle="mobileSmall"
          color="hubbard.100"
          pb={["6px", "0px"]}
        >
          {dateHeadingText(startDateLocal)}
        </Text>
        <Text
          textStyle="mobileHeader4"
          whiteSpace="nowrap"
          minWidth="225px"
          pb={["18px", "0px"]}
        >
          {`${startTimeLocal}-${endTimeLocal}`}
        </Text>
        {volunteerNeeded ? (
          <HStack minWidth="225px" pb={["12px", "0px"]}>
            <CheckIcon color={frequencyColorScheme} />
            <Text textStyle="mobileBody">Volunteers Requested</Text>
          </HStack>
        ) : (
          <HStack minWidth="225px" pb={["12px", "0px"]}>
            <CloseIcon w={3} color={frequencyColorScheme} mr="4px" />
            <Text textStyle="mobileBody">No Volunteers Needed</Text>
          </HStack>
        )}
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

export default FoodRescueCard;
