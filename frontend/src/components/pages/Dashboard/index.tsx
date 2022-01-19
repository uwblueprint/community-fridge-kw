import {
  Box,
  Button,
  Container,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import UPCOMING_WEEK_LIMIT from "../../../constants/DashboardConstants";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "./components/DropoffCard";

const Dashboard = (): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    const getSchedules = async () => {
      const donor = await DonorAPIClient.getDonorByUserId(
        authenticatedUser!.id,
      );

      const scheduleResponse = await SchedulingAPIClient.getScheduleByDonorId(
        donor.id,
        UPCOMING_WEEK_LIMIT,
      );

      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

  if (!schedules || schedules === null) {
    return <Spinner />;
  }

  return (
    <Container variant="dashboardContainer">
      <Stack direction={["column", "row"]} justifyContent="space-between">
        <VStack alignItems="left">
          <Text color="black.100" textStyle="mobileHeader1">
            My Upcoming Donations
          </Text>
          <Text pt="0.8rem" textStyle="mobileBody" color="hubbard.100">
            Thank you for supporting your local community fridge!{" "}
          </Text>
        </VStack>
        <Button
          float="right"
          mt="1.5rem"
          size="lg"
          width={{ lg: "30%", base: "100%" }}
          variant="navigation"
          onClick={() => history.push(Routes.SCHEDULING_PAGE)}
        >
          Schedule new donation
        </Button>
      </Stack>
      <Box
        display={{ lg: "flex" }}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={["60px", "70px"]}
      >
        {schedules.length > 0 ? (
          schedules.map((scheduleObject: Schedule, id) => (
            <DropoffCard key={id} schedule={scheduleObject!} />
          ))
        ) : (
          <Text as="i" pt="0.8rem" textStyle="mobileBody" mb="1.5rem">
            You currently have no upcoming donations scheduled for the next two
            weeks.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
