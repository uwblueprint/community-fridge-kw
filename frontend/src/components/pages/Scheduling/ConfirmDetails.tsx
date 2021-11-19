import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import { SCHEDULE_THANKYOU_PAGE } from "../../../constants/Routes";
import * as Routes from "../../../constants/Routes";
import { DonorResponse } from "../../../types/DonorTypes";
import { SchedulingStepProps } from "./types";

const ConfirmDetails = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, go } = navigation;
  const history = useHistory();

  const onSubmitClick = async () => history.push(SCHEDULE_THANKYOU_PAGE);

  //   const { insert form fields for this page here } = formData;
  const [currentDonor, setCurrentDonor] = useState<DonorResponse>(
    {} as DonorResponse,
  );
  const currentSchedule = formValues;

  const getDonorData = async () => {
    const donorResponse = await DonorAPIClient.getDonorById(
      currentSchedule.donorId,
    );
    setCurrentDonor(donorResponse);
  };

  useEffect(() => {
    getDonorData();
  }, [currentSchedule.id]);

  return (
    // Insert confirm Donation detail page here
    <Container ml="1rem" mt="2.5rem" mb="1.5rem">
      {isBeingEdited && (
        <IconButton
          onClick={() => history.push(Routes.DASHBOARD_PAGE)}
          marginLeft="-12px"
          variant="ghost"
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
      )}

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
          onClick={() => go && go("date and time")}
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
          onClick={() => go && go("donation information")}
        >
          Edit
        </Button>
        <Text textStyle="mobileHeader2">Donation Information</Text>
        <Text textStyle="mobileBody">{currentSchedule.size}</Text>
        <Text textStyle="mobileBody">
          {currentSchedule.categories.join(", ")}
        </Text>
      </Container>

      <Container pl="0" align="left" mb="2rem">
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("donation information")}
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
        <Text textStyle="mobileHeader2">Donor information</Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Container>
      {isBeingEdited ? (
        <VStack>
          <Button variant="navigation">Save Changes</Button>
          <Button variant="navigation">Cancel</Button>
        </VStack>
      ) : (
        <HStack>
          <Button onClick={previous} variant="navigation">
            Back
          </Button>
          <Button onClick={onSubmitClick} variant="navigation">
            Submit
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default ConfirmDetails;
