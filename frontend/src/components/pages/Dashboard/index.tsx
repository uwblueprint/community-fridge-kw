import { Box, Button, Container, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "./components/DropoffCard";

const upcomingWeekLimit = "2";

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
        upcomingWeekLimit,
      );

      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

  if (!authenticatedUser) {
    return <Redirect to={Routes.LOGIN_PAGE} />;
  }

  return (
    <Container maxWidth={{ base: "default", md: "70%" }} pt="73px">
      <Text color="black.100" textStyle="mobileHeader1">
        Welcome {authenticatedUser?.firstName}!
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody">
        Thank you for your efforts in volunteering with the community fridge
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
        Upcoming Dropoffs
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody" mb="1.5rem">
        View all of the upcoming donations that you have scheduled for the next
        2 weeks
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
            You currently have no upcoming dropoffs scheduled for the next two
            weeks.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
