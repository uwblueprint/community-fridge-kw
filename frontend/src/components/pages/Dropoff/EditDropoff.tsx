import { EditIcon } from "@chakra-ui/icons";
import { Badge, Button, Container, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useLocation, useParams } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";

const EditDropoffPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const query = useLocation().search;

  const donorId = new URLSearchParams(query).get("donorId") ?? "";

  const [currentSchedule, setCurrentSchedule] = React.useState<Schedule>();
  const [currentDonor, setCurrentDonor] = React.useState<DonorResponse>();

  React.useEffect(() => {
    const getScheduleData = async () => {
      const response = await SchedulingAPIClient.getScheduleById(id);
      setCurrentSchedule(response);
    };

    const getDonorData = async () => {
      const response = await DonorAPIClient.getDonorById(donorId);
      setCurrentDonor(response);
    };

    getScheduleData();
    getDonorData();
  }, [id, donorId]);

  if (!currentSchedule || !currentDonor) {
    return <div>Invalid Schedule or Donor</div>;
  }

  return (
    <Container ml="32px" mt="64px" mb="60px">
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

      <Container pl="0" align="left" mb="56px">
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

      <Container pl="0" align="left" mb="56px">
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

export default EditDropoffPage;
