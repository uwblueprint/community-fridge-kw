import { Box, Button, Container, Spinner, Text } from "@chakra-ui/react";
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

  const deleteSchedule = async (id: string) => {
    await SchedulingAPIClient.deleteSchedule(id);
    if (schedules) {
      setSchedules(schedules.filter((s) => s?.id !== id));
    }
  };

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
      <Text color="black.100" textStyle="mobileHeader1">
        Welcome {authenticatedUser?.firstName}!
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody">
        Thank you for supporting your local community fridge!{" "}
      </Text>
      <Button
        mt="1.5rem"
        size="lg"
        width={{ lg: "30%", base: "100%" }}
        variant="navigation"
        onClick={() => history.push(Routes.SCHEDULING_PAGE)}
      >
        Schedule new donation
      </Button>
      <Text mt="4rem" textStyle="mobileHeader1">
        Your Upcoming Donations
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody" mb="1.5rem">
        View all of the upcoming donations that you have scheduled for the next
        two weeks
      </Text>
      <Box display={{ lg: "flex" }} flexDirection="row" flexWrap="wrap">
        {schedules.length > 0 ? (
          schedules.map((scheduleObject: Schedule, id) => (
            <DropoffCard
              key={id}
              schedule={scheduleObject!}
              onDelete={() => deleteSchedule(scheduleObject!.id)}
            />
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
