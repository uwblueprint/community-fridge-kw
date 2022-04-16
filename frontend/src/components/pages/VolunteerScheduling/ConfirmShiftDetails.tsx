import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import VolunteerContext from "../../../contexts/VolunteerContext";
import { DonorResponse } from "../../../types/DonorTypes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import FridgeFoodRescueDescription from "../../common/FridgeFoodRescueDescription";
import GeneralDeleteShiftModal from "../../common/GeneralDeleteShiftModal";
import BackButton from "../Scheduling/BackButton";
import { DonationSizes } from "../Scheduling/types";

const ConfirmShiftDetails = ({
  navigation,
  shift,
  viewDetailsScreen = false,
}: {
  navigation?: NavigationProps;
  shift: ScheduleWithShiftType | CheckInWithShiftType;
  viewDetailsScreen?: boolean;
}) => {
  let previous: (() => void) | undefined;
  let next: () => void;
  if (navigation) {
    previous = navigation.previous;
    next = navigation.next;
  }
  const { authenticatedUser } = useContext(AuthContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { volunteerId } = useContext(VolunteerContext);
  const history = useHistory();
  const [currentDonor, setCurrentDonor] = useState<DonorResponse>(
    {} as DonorResponse,
  );

  const onSubmitClick = async () => {
    if (volunteerId) {
      const updateShiftValues = {
        volunteerId: String(volunteerId),
      };
      const res =
        shift.type === ShiftType.SCHEDULING
          ? await SchedulingAPIClient.updateSchedule(
              shift.id,
              updateShiftValues,
            )
          : await CheckInAPIClient.updateCheckInById(
              shift.id,
              updateShiftValues,
            );
      if (!res) {
        console.error("Error when confirming shift details with volunteer.");
        return;
      }
    }
    next();
  };

  const getDonorData = async () => {
    const donorResponse = await DonorAPIClient.getDonorById(
      (shift as ScheduleWithShiftType).donorId,
    );
    setCurrentDonor(donorResponse);
  };

  const getDescription = () => {
    if ((shift as ScheduleWithShiftType).size !== "") {
      const { description } = DonationSizes.filter(
        (category) => category.size === (shift as ScheduleWithShiftType).size,
      )[0];
      return description;
    }
    return "";
  };

  const onDeleteClick = async () => {
    const res =
      shift.type === ShiftType.SCHEDULING
        ? await SchedulingAPIClient.updateSchedule(shift.id, {
            ...shift,
            volunteerId: null,
          })
        : await CheckInAPIClient.updateCheckInById(shift.id, {
            ...shift,
            volunteerId: null,
          });

    if (!res) {
      toast({
        title: "Volunteer shift could not be cancelled. Please try again",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Volunteer shift cancelled successfully",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    }
    history.push(Routes.VOLUNTEER_DASHBOARD_PAGE);
  };

  useEffect(() => {
    if (shift.type === ShiftType.SCHEDULING) {
      getDonorData();
    }
  }, []);

  const dateText = (date: string) => {
    return date ? format(new Date(date), "MMMM d, yyyy") : "";
  };

  const startAndEndTimeLocal = (date: string) => {
    return date ? format(new Date(date), "h:mm aa") : "";
  };

  const volunteerTimeLocal = (date: string | null) => {
    return date ? format(parse(date, "HH:mm", new Date()), "h:mm a") : "";
  };

  return (
    <Container variant="responsiveContainer">
      <BackButton
        previous={
          viewDetailsScreen
            ? () => history.push(Routes.VOLUNTEER_DASHBOARD_PAGE)
            : previous
        }
      />
      {viewDetailsScreen && shift.type === ShiftType.CHECKIN && (
        <FridgeCheckInDescription />
      )}
      {viewDetailsScreen && shift.type === ShiftType.SCHEDULING && (
        <FridgeFoodRescueDescription />
      )}
      {!viewDetailsScreen && (
        <>
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
        </>
      )}
      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Shift details</Text>
        <Text textStyle="mobileBody" color="hubbard.100" pt="1.4em">
          {viewDetailsScreen
            ? `Please ensure you are at the meetup location at the specified volunteer arrival time.`
            : `You are signing up to volunteer for the following shift. Please note
            your contact information will be shared with the donor.`}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Volunteer shift type
        </Text>
        {shift.type === ShiftType.SCHEDULING && (
          <Text textStyle="mobileBody">{`Food rescue ${
            shift.isPickup ? "pickup" : "unloading"
          }`}</Text>
        )}
        {shift.type === ShiftType.CHECKIN && (
          <Text textStyle="mobileBody">Fridge check in</Text>
        )}

        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Volunteer arrival time
        </Text>

        <Text textStyle="mobileBody">
          {shift.type === ShiftType.SCHEDULING
            ? dateText(shift.startTime)
            : dateText(shift.startDate)}
        </Text>
        <Text textStyle="mobileBody">
          {shift.type === ShiftType.SCHEDULING
            ? volunteerTimeLocal(shift.volunteerTime)
            : startAndEndTimeLocal(shift.startDate)}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Address
        </Text>
        <Text textStyle="mobileBody">{`${
          (shift as ScheduleWithShiftType).isPickup
            ? `${(shift as ScheduleWithShiftType).pickupLocation}`
            : "Community Fridge"
        }`}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Additional notes
        </Text>
        {shift.type === ShiftType.SCHEDULING && (
          <Text textStyle="mobileBody">{`${
            shift.notes === null || shift.notes === "" ? "-" : shift.notes
          }`}</Text>
        )}
        {shift.type === ShiftType.CHECKIN && (
          <Text textStyle="mobileBody">{`${
            shift.notes === null || shift.notes === "" ? "-" : shift.notes
          }`}</Text>
        )}
      </Box>

      {shift.type === ShiftType.SCHEDULING && (
        <>
          <Box m="3em 0" pl="0" align="left">
            <Text textStyle="mobileHeader3">Donation information</Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Donation time
            </Text>

            <Text textStyle="mobileBody">{dateText(shift.startTime)}</Text>
            <Text textStyle="mobileBody">
              {`${startAndEndTimeLocal(
                shift.startTime,
              )} - ${startAndEndTimeLocal(shift.endTime)}`}
            </Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Size
            </Text>
            <Text textStyle="mobileBody">{`${
              shift.size
            } - ${getDescription()}`}</Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Item category
            </Text>
            <Text textStyle="mobileBody">
              {shift.categories ? shift.categories.join(", ") : ""}
            </Text>
          </Box>
          <Box m="3em 0" pl="0" align="left">
            <Text textStyle="mobileHeader3">Donor information</Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Name
            </Text>
            <Text textStyle="mobileBody">
              {`${currentDonor.firstName} ${currentDonor.lastName}`}
            </Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Email
            </Text>
            <Text textStyle="mobileBody">{currentDonor.email}</Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Phone
            </Text>
            <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Organization
            </Text>
            <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
          </Box>{" "}
        </>
      )}

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
      {viewDetailsScreen && (
        <Button
          mt="1.5rem"
          size="lg"
          width={{ lg: "30%", base: "100%" }}
          variant="deleteDonation"
          onClick={onOpen}
        >
          Cancel volunteer shift
        </Button>
      )}
      <GeneralDeleteShiftModal
        title="Cancel volunteer shift"
        bodyText={`Are you sure you want to cancel your volunteer shift on ${
          shift.type === ShiftType.SCHEDULING
            ? `${dateText(shift.startTime)} at ${volunteerTimeLocal(
                shift.volunteerTime,
              )}`
            : `${dateText(shift.startDate)} at ${startAndEndTimeLocal(
                shift.startDate,
              )}`
        }? This will notify all respective parties, including the CFKW admin team.`}
        buttonLabel="Cancel volunteer shift"
        isOpen={isOpen}
        onClose={onClose}
        onDelete={onDeleteClick}
      />
    </Container>
  );
};

export default ConfirmShiftDetails;
