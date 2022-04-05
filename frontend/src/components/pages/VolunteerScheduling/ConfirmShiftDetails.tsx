import { Box, Button, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import { VolunteerResponse } from "../../../types/VolunteerTypes";
import BackButton from "../Scheduling/BackButton";
import { DonationSizes } from "../Scheduling/types";

const ConfirmShiftDetails = ({
  navigation,
  shiftId,
  isFoodRescue,
}: {
  navigation: NavigationProps;
  shiftId: string;
  isFoodRescue: boolean;
}) => {
  const { previous, next, go } = navigation;
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);

  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerResponse>(
    {} as VolunteerResponse,
  );
  // const currentSchedule = formValues;
  // const { description } = DonationSizes.filter(
  //   (category) => category.size === currentSchedule.size,
  // )[0];
  const [currentShift, setCurrentShift] = useState<Schedule | CheckIn>(
    {} as Schedule | CheckIn,
  );
  const schedulingDefaultData = ({
    id: "",
    donorId: "",
    categories: [],
    size: "",
    dayPart: "",
    startTime: "",
    endTime: "",
    frequency: "",
    notes: "",
    volunteerTime: "",
  } as unknown) as Schedule;

  const donorDefaultData = ({
    id: "",
    businessName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  } as unknown) as DonorResponse;

  const [currentDonor, setCurrentDonor] = useState<DonorResponse>(
    donorDefaultData,
  );

  const [currentFoodRescue, setCurrentFoodRescue] = useState<Schedule>(
    schedulingDefaultData,
  );
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckIn>({} as CheckIn);

  const onSubmitClick = async () => {
    // sign up logic
    next();
  };

  const getDonorData = async () => {
    const donorResponse = await DonorAPIClient.getDonorById(
      currentFoodRescue.donorId,
    );
    setCurrentDonor(donorResponse);
  };

  const getFoodRescueData = async () => {
    const foodRescueResponse = await SchedulingAPIClient.getScheduleById(
      shiftId,
    );

    setCurrentFoodRescue(foodRescueResponse);
  };

  const getCheckInData = async () => {
    const checkInResponse = await CheckInAPIClient.getCheckInsById(shiftId);
    setCurrentCheckIn(checkInResponse);
  };

  const getDescription = () => {
    if (currentFoodRescue.size !== "") {
      const { description } = DonationSizes.filter(
        (category) => category.size === currentFoodRescue.size,
      )[0];
      return description;
    }
    return "";
  };

  useEffect(() => {
    if (isFoodRescue) {
      getFoodRescueData();
      getDonorData();
    } else {
      getCheckInData();
    }
  }, [currentDonor, currentFoodRescue]);

  const dateText = () => {
    if (currentFoodRescue.startTime !== "") {
      const startDateLocal = new Date(currentFoodRescue.startTime);
      return format(startDateLocal, "MMMM d, yyyy");
    }
    return "";
  };

  const startTimeLocal = () => {
    if (currentFoodRescue.startTime !== "") {
      return format(new Date(currentFoodRescue.startTime), "h:mm aa");
    }
    return "";
  };

  const endTimeLocal = () => {
    if (currentFoodRescue.endTime !== "") {
      return format(new Date(currentFoodRescue.endTime), "h:mm aa");
    }
    return "";
  };

  const volunteerTimeLocal = () => {
    return (
      currentFoodRescue.volunteerTime &&
      format(
        parse(currentFoodRescue.volunteerTime, "kk:mm", new Date()),
        "h:mm a",
      )
    );
  };

  const donorName = () => {
    if (currentDonor.firstName !== "") {
      return currentDonor.firstName;
    }
    return "";
  };

  return (
    <Container variant="responsiveContainer">
      <>
        <BackButton previous={previous} />
      </>

      <Text
        textStyle="mobileHeader2"
        mt="1em"
        direction="row"
        display={{ md: "flex" }}
        mb="1em"
      >
        Confirm shift sign-up &nbsp;&nbsp;&nbsp;
      </Text>
      <HStack>
        <Flex justify="flex-end">
          <Button onClick={onSubmitClick} variant="navigation">
            Confirm shift sign-up
          </Button>
        </Flex>
      </HStack>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Shift details</Text>
        <Text textStyle="mobileBody" color="hubbard.100" pt="1.4em">
          You are signing up to volunteer for the following shift. Please note
          your contact information will be shared with the donor.
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Volunteer shift type
        </Text>
        <Text textStyle="mobileBody">{`Food rescue ${
          currentFoodRescue.isPickup ? "pickup" : "unloading"
        }`}</Text>

        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Volunteer arrival time
        </Text>

        <Text textStyle="mobileBody">{dateText()}</Text>
        <Text textStyle="mobileBody">{volunteerTimeLocal()}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Address
        </Text>
        <Text textStyle="mobileBody">{`${
          currentFoodRescue.isPickup
            ? `${currentFoodRescue.pickupLocation}`
            : "Community Fridge"
        }`}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Additional notes
        </Text>
        <Text textStyle="mobileBody">{`${
          currentFoodRescue.notes === null || currentFoodRescue.notes === ""
            ? "-"
            : currentFoodRescue.notes
        }`}</Text>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Donation information</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Donation time
        </Text>

        <Text textStyle="mobileBody">{dateText()}</Text>
        <Text textStyle="mobileBody">
          {`${startTimeLocal()} - ${endTimeLocal()}`}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Size
        </Text>
        <Text textStyle="mobileBody">{`${
          currentFoodRescue.size
        } - ${getDescription()}`}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Item category
        </Text>
        <Text textStyle="mobileBody">
          {currentFoodRescue.categories
            ? currentFoodRescue.categories.join(", ")
            : ""}
        </Text>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Donor information</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Name
        </Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Email
        </Text>
        <Text textStyle="mobileBody">
          {currentDonor.email !== "" ? currentDonor.email : "hi"}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Phone
        </Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Organization
        </Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Volunteer information</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Name
        </Text>
        <Text textStyle="mobileBody">
          {`${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`}
        </Text>

        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Email
        </Text>
        <Text textStyle="mobileBody">{authenticatedUser?.email}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Phone
        </Text>
        <Text textStyle="mobileBody">{authenticatedUser?.phoneNumber}</Text>
      </Box>
    </Container>
  );
};

export default ConfirmShiftDetails;
