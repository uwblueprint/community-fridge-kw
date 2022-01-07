import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { colorMap } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { DonorResponse } from "../../../types/DonorTypes";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const ConfirmDetails = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next, go } = navigation;
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);

  const [currentDonor, setCurrentDonor] = useState<DonorResponse>(
    {} as DonorResponse,
  );
  const currentSchedule = formValues;

  const onSubmitClick = async () => {
    await SchedulingAPIClient.createSchedule(currentSchedule);
    next();
  };

  const getDonorData = async () => {
    const donorResponse = await DonorAPIClient.getDonorByUserId(
      authenticatedUser!.id,
    );
    setForm({ target: { name: "donorId", value: donorResponse.id } });
    setCurrentDonor(donorResponse);
  };

  useEffect(() => {
    getDonorData();
  }, [currentSchedule.id]);
  return (
    <Container variant="responsiveContainer">
      {isBeingEdited ? (
        <IconButton
          onClick={() => history.push(Routes.DASHBOARD_PAGE)}
          marginLeft="-12px"
          variant="ghost"
          aria-label="back"
        >
          <ArrowBackIcon width="24px" height="24px" />
        </IconButton>
      ) : (
        <SchedulingProgressBar activeStep={3} totalSteps={4} />
      )}
      {isBeingEdited ? (
        <Text textStyle="mobileHeader1" mt="2em">
          Donation Details
        </Text>
      ) : (
        <Text textStyle="mobileHeader2" mt="2em">
          Confirm Donation Details
        </Text>
      )}

      <Badge
        borderRadius="full"
        pt="6px"
        pb="6px"
        pl="14px"
        pr="14px"
        color={`${(colorMap as any)[currentSchedule?.frequency]}.100`}
        backgroundColor={`${(colorMap as any)[currentSchedule?.frequency]}.50`}
      >
        {currentSchedule?.frequency}
      </Badge>

      <Box
        pl="0"
        align="left"
        mt="2rem"
        mb="2rem"
        display={{ lg: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("date and time")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader2">Proposed dropoff time</Text>
          <Text textStyle="mobileBody">
            {new Date(currentSchedule.startTime).toDateString()}
          </Text>
          <Text textStyle="mobileBody">
            {new Date(currentSchedule.startTime).toLocaleTimeString()}-
            {new Date(currentSchedule.endTime).toLocaleTimeString()}
          </Text>
          <Text textStyle="mobileBody">{currentSchedule.frequency}</Text>
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ lg: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("donation information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader2">Donation Information</Text>
          <Text textStyle="mobileBody">{currentSchedule.size}</Text>
          <Text textStyle="mobileBody">
            {currentSchedule.categories.join(", ")}
          </Text>
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ lg: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Button
          rightIcon={<EditIcon />}
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("volunteer information")}
        >
          Edit
        </Button>
        <Box>
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
        </Box>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader2">Donor information</Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Box>
      {!isBeingEdited && (
        <HStack>
          <Button
            onClick={previous}
            variant="navigation"
            width={{ base: "100%", md: "20%" }}
          >
            Back
          </Button>
          <Button
            onClick={onSubmitClick}
            variant="navigation"
            width={{ base: "100%", md: "20%" }}
          >
            Submit
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default ConfirmDetails;
