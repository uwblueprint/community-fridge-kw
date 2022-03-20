import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../../APIClients/DonorAPIClient";
import VolunteerAPIClient from "../../../../APIClients/VolunteerAPIClient";
import { getFrequencyColor } from "../../../../constants/DaysInWeek";
import * as Routes from "../../../../constants/Routes";
import { Schedule } from "../../../../types/SchedulingTypes";
import {
  dateHeadingText,
  getAssistanceType,
} from "../../../../utils/DashboardUtils";
import { DonationFrequency } from "../../Scheduling/types";

const DropoffCardSubInformation = ({
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

const DropoffCard = ({
  schedule,
  isDonorView,
  isPublicView = false,
}: {
  schedule: Schedule;
  isDonorView: boolean;
  isPublicView?: boolean;
}): JSX.Element => {
  const {
    startTime,
    endTime,
    id,
    frequency,
    volunteerNeeded,
    isPickup,
    volunteerTime,
    volunteerId,
    donorId,
    categories,
  } = schedule;
  const history = useHistory();
  const frequencyColorScheme = getFrequencyColor(frequency);
  const [volunteerAssigned, setVolunteerAssigned] = React.useState("");
  const [donorName, setDonorName] = React.useState("");
  const startDateLocal = new Date(startTime);
  const startTimeLocal = format(new Date(startTime), "h:mm aa");
  const endTimeLocal = format(new Date(endTime), "h:mm aa");

  React.useEffect(() => {
    const getVolunteerName = async (vId: string) => {
      if (volunteerId) {
        const response = await VolunteerAPIClient.getVolunteerById(vId);
        setVolunteerAssigned(`${response.firstName} ${response.lastName}`);
      }
    };

    const getDonorName = async (dId: string) => {
      if (dId) {
        const response = await DonorAPIClient.getDonorById(dId);
        setDonorName(`${response.businessName}`);
      }
    };
    getVolunteerName(String(volunteerId));
    getDonorName(String(donorId));
  }, []);

  return (
    <Box
      pb="50px"
      pt="32px"
      pl="30px"
      mb="24px"
      borderLeft={`7px solid ${getFrequencyColor(frequency)}`}
      boxShadow="2px 2px 12px rgba(0, 0, 0, 0.08)"
      width={{ base: "default", md: "100%" }}
      overflow="hidden"
    >
      <VStack alignItems="left">
        <Stack
          direction={["column", "row"]}
          spacing={["4px", "24px"]}
          mb={["4px", "21px"]}
        >
          <Text
            textStyle="mobileHeader4"
            whiteSpace="nowrap"
            pb={["18px", "0px"]}
          >
            {isDonorView ? dateHeadingText(startDateLocal) : donorName}
          </Text>
          {!isPublicView && (
            <Text
              color="h20.100"
              textDecoration="underline"
              onClick={() => history.push(`${Routes.DASHBOARD_PAGE}/${id}`)}
            >
              View Details
            </Text>
          )}
        </Stack>
        <Stack direction={["column", "row"]} spacing={["20px", "40px"]}>
          <DropoffCardSubInformation
            description="Donation Time"
            value={`${startTimeLocal}-${endTimeLocal}`}
          />
          <DropoffCardSubInformation
            description="Frequency"
            value={
              frequency === DonationFrequency.ONE_TIME
                ? ` Donation`
                : ` Recurring Donation`
            }
            isFrequencyBlock
            frequency={frequency}
            frequencyColorScheme={frequencyColorScheme}
          />
          {isPublicView ? (
            <DropoffCardSubInformation
              description="Type of Donation Items"
              value={categories.join(" ; ")}
            />
          ) : (
            <>
              <DropoffCardSubInformation
                description="Volunteer Request Time"
                value={
                  volunteerTime
                    ? format(
                        parse(volunteerTime, "kk:mm", new Date()),
                        "h:mm aa",
                      )
                    : "-"
                }
              />
              <DropoffCardSubInformation
                description="Assistance Type"
                value={volunteerNeeded ? getAssistanceType(isPickup!) : "-"}
              />
              <DropoffCardSubInformation
                description="Volunteer Assigned"
                value={volunteerId ? volunteerAssigned : "-"}
              />
            </>
          )}
        </Stack>
      </VStack>
    </Box>
  );
};

export default DropoffCard;
