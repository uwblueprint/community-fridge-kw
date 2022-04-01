import { Box, Button, Divider, Stack, Text, VStack } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../../APIClients/DonorAPIClient";
import { Schedule } from "../../../../types/SchedulingTypes";
import { dateHeadingText } from "../../../../utils/DashboardUtils";
import { DonationFrequency } from "../../Scheduling/types";

const FoodRescueCardSubInformation = ({
  description,
  value,
  isFrequencyBlock,
  frequency,
  frequencyColorScheme,
}: {
  description: string;
  value: string;
  isFrequencyBlock?: boolean;
  frequency?: string;
  frequencyColorScheme?: string;
}) => (
  <VStack spacing="4px" alignItems="left" minWidth="10vw">
    <Text textTransform="uppercase" color="hubbard.100" textStyle="mobileSmall">
      {description}
    </Text>
    <Text color="black.100" textStyle="desktopBody">
      {isFrequencyBlock && (
        <Box as="span" textStyle="mobileBodyBold" color={frequencyColorScheme}>
          {frequency === DonationFrequency.ONE_TIME ? "One time" : frequency}
        </Box>
      )}
      {value}
    </Text>
  </VStack>
);

const FoodRescueCard = ({
  schedule,
  navigation,
}: {
  schedule: Schedule;
  navigation: NavigationProps;
}): JSX.Element => {
  const {
    startTime,
    endTime,
    id,
    isPickup,
    volunteerTime,
    volunteerId,
    donorId,
    pickupLocation,
    notes,
    dayPart,
  } = schedule;
  const history = useHistory();
  const [donorName, setDonorName] = React.useState("");

  const startDateLocal = new Date(startTime);
  const startTimeLocal = format(new Date(startTime), "h:mm aa");
  const endTimeLocal = format(new Date(endTime), "h:mm aa");
  const { next } = navigation;

  React.useEffect(() => {
    const getDonorName = async () => {
      if (donorId) {
        const response = await DonorAPIClient.getDonorById(String(donorId));
        setDonorName(`${response.businessName}`);
      }
    };

    getDonorName();
  }, []);

  return (
    <Box>
      <Divider />
      <Text
        pt="0.8rem"
        textStyle="mobileHeader4"
        color="black.100"
      >{`${dateHeadingText(startDateLocal)}`}</Text>
      <Text pt="0 rem" pb="0.8rem" textStyle="mobileBody" color="hubbard.100">
        {`Food rescue ${isPickup ? "pickup" : "unloading"}`}{" "}
      </Text>
      <Button variant="navigation" onClick={next}>
        Volunteer for shift
      </Button>
      <Text pb="1rem"> </Text>

      <Box
        pb="32px"
        pt="32px"
        px="30px"
        mb="24px"
        width="100%"
        overflow="hidden"
        bgColor={isPickup ? "turnip.50" : "onion.50"}
      >
        <VStack alignItems="left">
          {/* <Stack
          direction={["column", "row"]}
          spacing={["4px", "24px"]}
          mb={["4px", "21px"]}
        >
          <Text textStyle="mobileHeader4" whiteSpace="nowrap">
            {isDonorView ? dateHeadingText(startDateLocal) : donorName}
          </Text>
          {!isPublicView && (
            <Text
              color="h20.100"
              textDecoration="underline"
              onClick={() => history.push(`${Routes.DASHBOARD_PAGE}/${id}`)}
              pb={["24px", "0px"]}
              cursor="pointer"
            >
              View Details
            </Text>
          )}
        </Stack> */}
          <Stack direction={["column", "row"]} spacing={["20px", "40px"]}>
            <FoodRescueCardSubInformation
              description="Organization"
              value={`${donorName}`}
            />
            <FoodRescueCardSubInformation
              description="Volunteer Request Time"
              value={
                volunteerTime
                  ? format(parse(volunteerTime, "kk:mm", new Date()), "h:mm aa")
                  : "-"
              }
            />
            {/* <DropoffCardSubInformation
                description="Assistance Type"
                value={volunteerNeeded ? getAssistanceType(isPickup!) : "-"}
              /> */}
            <FoodRescueCardSubInformation
              description="Location"
              value={isPickup ? `${pickupLocation}` : "Community Fridge"}
            />
            <FoodRescueCardSubInformation
              description="Notes"
              value={notes === null || notes === "" ? "-" : `${notes}`}
            />
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
};

export default FoodRescueCard;
