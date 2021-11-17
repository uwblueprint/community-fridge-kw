import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Container,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";

const EditDashboard = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [currentSchedule, setCurrentSchedule] = useState<Schedule>(null);
  const [currentDonor, setCurrentDonor] = useState<DonorResponse>();

  const getScheduleAndDonorData = async () => {
    const scheduleResponse = await SchedulingAPIClient.getScheduleById(id);
    setCurrentSchedule(scheduleResponse);
    if (scheduleResponse) {
      const donorResponse = await DonorAPIClient.getDonorById(
        scheduleResponse!.donorId,
      );
      setCurrentDonor(donorResponse);
    }
  };

  useEffect(() => {
    getScheduleAndDonorData();
  }, []);

  if (!currentSchedule || !currentDonor) {
    return <div>Invalid Schedule or Donor</div>;
  }

  return (
    <Container ml="1rem" mt="2.5rem" mb="1.5rem">
      <IconButton
        onClick={() => history.push(Routes.DASHBOARD_PAGE)}
        marginLeft="-12px"
        variant="ghost"
        aria-label="back"
      >
        <ArrowBackIcon />
      </IconButton>
      <Text textStyle="mobileHeader1" mb="12px">
        Donation Details
      </Text>
      <Badge
        borderRadius="full"
        pt="6px"
        pb="6px"
        pl="14px"
        pr="14px"
        color="squash.100"
        backgroundColor="evergreen.100"
        mb="56px"
      >
        {currentSchedule?.frequency}
      </Badge>

      <Container pl="0" align="left" mb="2rem">
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
        >
          Edit
        </Button>
        <Text textStyle="mobileHeader2">Proposed dropoff time</Text>
        <Text textStyle="mobileBody">
          {new Date(currentSchedule.startTime).toDateString()}
        </Text>
        <Text textStyle="mobileBody">
          {new Date(currentSchedule.startTime).toLocaleTimeString()}-
          {new Date(currentSchedule.endTime).toLocaleTimeString()}
        </Text>
        <Text textStyle="mobileBody">{currentSchedule.frequency}</Text>
      </Container>

      <Container pl="0" align="left" mb="2rem">
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
        >
          Edit
        </Button>
        <Text textStyle="mobileHeader2">Volunteer Information</Text>
        {currentSchedule.volunteerNeeded && (
          <Text textStyle="mobileBody">Volunteer required</Text>
        )}
        {currentSchedule.isPickup && (
          <Text textStyle="mobileBody">Pickup required</Text>
        )}
        <Text textStyle="mobileBody">{currentSchedule.pickupLocation}</Text>

        <Text textStyle="mobileBody">
          Additional notes: {currentSchedule.notes}
        </Text>
      </Container>

      <Container pl="0" align="left">
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
        >
          Edit
        </Button>
        <Text textStyle="mobileHeader2">Donor information</Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Container>
    </Container>
  );
};

export default EditDashboard;
