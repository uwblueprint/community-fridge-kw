import { Button, Container, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
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
      );

      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

  if (!authenticatedUser) {
    return <Redirect to={Routes.HOME_PAGE} />;
  }

  return (
    <Container pl="42px" pr="42px" pt="73px">
      <Text color="black.100" textStyle="mobileHeader1">
        Welcome {authenticatedUser?.firstName}!
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody">
        Thank you for your efforts in volunteering with the community fridge
      </Text>
      <Button
        mt="1.5rem"
        size="lg"
        variant="navigation"
        onClick={() => history.push(Routes.SCHEDULING_PAGE)}
      >
        Schedule new donation
      </Button>
      <Text mt="3rem" textStyle="mobileHeader1">
        Upcoming Dropoffs
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody" mb="0.8rem">
        View all of the upcoming donations that you have scheduled{" "}
      </Text>
      {schedules.length > 0 &&
        schedules.map((scheduleObject: Schedule, id) => (
          <DropoffCard
            key={id}
            schedule={scheduleObject!}
            onDelete={() => deleteSchedule(scheduleObject!.id)}
          />
        ))}
    </Container>
  );
};

export default Dashboard;
