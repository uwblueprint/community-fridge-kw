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
import CardSubInformation from "../../../common/Card";
import { DonationFrequency } from "../../Scheduling/types";

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
  const startTimeLocal = format(new Date(startTime), "h:mmaa");
  const endTimeLocal = format(new Date(endTime), "h:mmaa");

  React.useEffect(() => {
    const getVolunteerName = async () => {
      if (volunteerId) {
        const response = await VolunteerAPIClient.getVolunteerById(
          String(volunteerId),
        );
        setVolunteerAssigned(`${response.firstName} ${response.lastName}`);
      }
    };

    const getDonorName = async () => {
      if (donorId) {
        const response = await DonorAPIClient.getDonorById(String(donorId));
        setDonorName(`${response.businessName}`);
      }
    };
    getVolunteerName();
    getDonorName();
  }, []);

  return (
    <Box
      p="30px 30px 40px 30px"
      mb="24px"
      border="1px solid"
      borderColor="dorian.100"
      borderLeft={`7px solid ${getFrequencyColor(frequency)}`}
      width="100%"
      overflow="hidden"
    >
      <VStack alignItems="left">
        <Stack
          direction={["column", "row"]}
          spacing={["4px", "24px"]}
          mb={["4px", "10px"]}
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
        </Stack>
        <Stack direction={["column", "row"]} spacing={["20px", "40px"]}>
          <CardSubInformation
            description="Donation Time"
            value={`${startTimeLocal}-${endTimeLocal}`}
          />
          <CardSubInformation
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
            <CardSubInformation
              description="Type of Donation Items"
              value={categories.join("; ")}
            />
          ) : (
            <>
              <CardSubInformation
                description="Volunteer Request Time"
                value={
                  volunteerTime
                    ? format(
                        parse(volunteerTime, "HH:mm", new Date()),
                        "h:mm aa",
                      )
                    : "-"
                }
              />
              <CardSubInformation
                description="Assistance Type"
                value={volunteerNeeded ? getAssistanceType(isPickup!) : "-"}
              />
              <CardSubInformation
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
