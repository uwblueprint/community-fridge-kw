import { Button, Container, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "./components/DropoffCard";

const Dropoff = (): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  const [schedule, setSchedule] = useState<Schedule[] | null>([]);
  const history = useHistory();

  if (!authenticatedUser) {
    history.push(Routes.LOGIN_PAGE);
  }

  const deleteSchedule = async (id: string) => {
    await SchedulingAPIClient.deleteSchedule(id);
    if (schedule) {
      setSchedule(schedule.filter((s) => s?.id !== id));
    }
  };

  React.useEffect(() => {
    const getSchedules = async () => {
      const donorID =
        (await DonorAPIClient.getAllDonors()).find(
          (donor: DonorResponse) => donor.userId === authenticatedUser?.id,
        )?.id ?? "";

      const scheduleResponse = await SchedulingAPIClient.getScheduleByDonorId(
        donorID,
      );

      setSchedule(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

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
      {schedule &&
        schedule.map((scheduleObject: any, id) => (
          <DropoffCard
            key={id}
            schedule={scheduleObject}
            onDelete={() => deleteSchedule(scheduleObject.id)}
          />
        ))}
    </Container>
  );
};

export default Dropoff;
