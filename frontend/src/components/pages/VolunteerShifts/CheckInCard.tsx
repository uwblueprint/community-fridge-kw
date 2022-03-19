import { CheckIcon, CloseIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { format, isToday, isTomorrow } from "date-fns";
import React from "react";
import { useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import { CheckIn } from "../../../types/CheckInTypes";

const CheckInCard = ({ checkIn }: { checkIn: CheckIn }): JSX.Element => {
  const {
    id,
    // volunteerId?,
    startDate,
    endDate,
    notes,
    // isAdmin?,
  } = checkIn;
  const startDateLocal = new Date(startDate);
  //   const startTimeLocal = format(new Date(startTime), "h:mm aa");
  //   const endTimeLocal = format(new Date(endTime), "h:mm aa");
  //   const formattedRecurringEndDate = format(
  //     new Date(recurringDonationEndDate),
  //     "MMM d, yyyy",
  //   );
  const startTimeLocal = "7:00AM";
  const endTimeLocal = "10:00AM";

  const dateHeadingText = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    if (isTomorrow(date)) {
      return "Tomorrow";
    }
    return format(date, "MMM d, yyyy");
  };

  const history = useHistory();

  return (
    <Box
      mb="24px"
      mr={{ base: "0px", md: "24px" }}
      boxShadow="2px 2px 12px rgba(0, 0, 0, 0.08)"
      width={{ base: "default", md: "100%" }}
      onClick={() => history.push(`${Routes.VOLUNTEER_SHIFTS_PAGE}/${id}`)}
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
        <Text>VOLUNTEER</Text>
        <Text
          textStyle="mobileHeader4"
          whiteSpace="nowrap"
          minWidth="225px"
          pb={["18px", "0px"]}
        >
          {`${startTimeLocal}-${endTimeLocal}`}
        </Text>
        <HStack minWidth="225px" pb={["12px", "0px"]}>
          <Text textStyle="mobileBody">NOTES</Text>
          <Text textStyle="mobileBody">
            {" "}
            {notes === "" || null ? `-` : notes}
          </Text>
        </HStack>
        )
      </Stack>
    </Box>
  );
};

export default CheckInCard;
