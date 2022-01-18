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

  const onDeleteClick = async () => {
    await SchedulingAPIClient.deleteSchedule(currentSchedule.id);
    history.push(`${Routes.DASHBOARD_PAGE}`);
    
  }

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
        mt="12px"
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
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("date and time")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader2">Drop-off Information</Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Proposed drop-off time</Text>
          <Text textStyle="mobileBody">
            {new Date(currentSchedule.startTime).toDateString()}
          </Text>
          <Text textStyle="mobileBody">
            {new Date(currentSchedule.startTime).toLocaleTimeString()}-
            {new Date(currentSchedule.endTime).toLocaleTimeString()}
          </Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Frequency</Text>
          <Text textStyle="mobileBodyBold" color={`${(colorMap as any)[currentSchedule?.frequency]}.100`}>{currentSchedule.frequency}</Text>
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
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("donation information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader2">Donation Information</Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Size</Text>
          <Text textStyle="mobileBody">{currentSchedule.size}</Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Item Category</Text>
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
          pl="0"
          variant="ghost"
          color="hubbard.100"
          onClick={() => go && go("volunteer information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader2">Volunteer Information</Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Volunteer Needed</Text>
          <Text textStyle="mobileBody">{currentSchedule.volunteerNeeded? "Yes": "No"}</Text>
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Pickup Needed</Text>
          <Text textStyle="mobileBody">{currentSchedule.isPickup? "Yes": "No"}</Text>

          
          {currentSchedule.isPickup && (
            <Box> 
              <Text textstyle="mobilePretitleBold" color="hubbard.100">Address</Text>
              <Text textStyle="mobileBody">{currentSchedule.pickupLocation}</Text> 
             </Box>
          )}
          
          <Text textstyle="mobilePretitleBold" color="hubbard.100">Additional notes</Text>
          <Text textStyle="mobileBody">{currentSchedule.notes}</Text>
        </Box>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader2">Donor Information</Text>
        <Text textstyle="mobilePretitleBold" color="hubbard.100">Name</Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textstyle="mobilePretitleBold" color="hubbard.100">Email</Text>
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textstyle="mobilePretitleBold" color="hubbard.100">Phone</Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textstyle="mobilePretitleBold" color="hubbard.100">Organization</Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Box>
      {isBeingEdited && (
        <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader2">Danger Zone</Text>
        <Text textStyle="mobileBody">
          To cancel this schedule donation, click below.
        </Text>
        <Button
          mt="1.5rem"
          size="lg"
          width={{ lg: "30%", base: "100%" }}
          variant="deleteDonation"
          onClick={onDeleteClick}
        >
        Cancel donation
        </Button>
      </Box>
      )}   
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
