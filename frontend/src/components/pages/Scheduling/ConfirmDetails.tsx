import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format, parse } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import { colorMap } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import { VolunteerResponse } from "../../../types/VolunteerTypes";
import GeneralDeleteShiftModal from "../../common/GeneralDeleteShiftModal";
import ErrorSchedulingModal from "../../common/GeneralErrorModal";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ModifyRecurringModal from "../Dashboard/components/ModifyRecurringDonationModal";
import BackButton from "./BackButton";
import { DonationFrequency, DonationSizes, SchedulingStepProps } from "./types";

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
  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerResponse>(
    {} as VolunteerResponse,
  );
  const currentSchedule = formValues;
  const { description } = DonationSizes.filter(
    (category) => category.size === currentSchedule.size,
  )[0];

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isErrorSchedulingOpen,
    onOpen: onErrorSchedulingOpen,
    onClose: onErrorSchedulingClose,
  } = useDisclosure();

  const onSubmitClick = async () => {
    const schedule = await SchedulingAPIClient.createSchedule(currentSchedule);

    if (!schedule.id) {
      onErrorSchedulingOpen();
      return;
    }

    next();
  };

  const onDeleteClick = async (isOneTimeEvent = true) => {
    const res = isOneTimeEvent
      ? await SchedulingAPIClient.deleteSchedule(
          currentSchedule.id,
          authenticatedUser!.role,
        )
      : await SchedulingAPIClient.deleteScheduleByRecurringId(
          currentSchedule?.recurringDonationId,
          currentSchedule.startTime,
          authenticatedUser!.role,
        );
    if (!res) {
      toast({
        title: "Donation could not be cancelled. Please try again",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } else {
      toast({
        title: isOneTimeEvent
          ? "Donation cancelled successfully"
          : "Donations cancelled successfully",
        status: "success",
        duration: 7000,
        isClosable: true,
      });
    }
    history.push(
      authenticatedUser!.role === Role.ADMIN
        ? Routes.ADMIN_VIEW_DONATIONS
        : Routes.DASHBOARD_PAGE,
    );
  };

  const getDonorData = async () => {
    const donorResponse = isBeingEdited
      ? await DonorAPIClient.getDonorById(currentSchedule.donorId)
      : await DonorAPIClient.getDonorByUserId(authenticatedUser!.id);
    setForm({ target: { name: "donorId", value: donorResponse.id } });
    setCurrentDonor(donorResponse);
  };

  const getVolunteerData = async () => {
    if (currentSchedule.volunteerId) {
      const volunteerResponse = await VolunteerAPIClient.getVolunteerById(
        currentSchedule.volunteerId.toString(),
      );
      setCurrentVolunteer(volunteerResponse);
    }
  };

  const startDateLocal = new Date(currentSchedule.startTime);
  const startTimeLocal = format(new Date(currentSchedule.startTime), "h:mm aa");
  const endTimeLocal = format(new Date(currentSchedule.endTime), "h:mm aa");

  const dayText = (startDate: Date) => {
    return format(startDate, "eeee");
  };
  const dateText = (startDate: Date) => {
    return format(startDate, "MMMM d, yyyy");
  };

  useEffect(() => {
    getDonorData();
    getVolunteerData();
  }, [currentSchedule.id]);
  return (
    <Container variant="responsiveContainer" pb={{ lg: "0px", base: "100px" }}>
      {isBeingEdited ? (
        <Box mt={10}>
          <Button
            onClick={() =>
              history.push(
                authenticatedUser?.role === Role.ADMIN
                  ? Routes.ADMIN_VIEW_DONATIONS
                  : Routes.DASHBOARD_PAGE,
              )
            }
            paddingLeft="0"
            backgroundColor="transparent"
          >
            <ArrowBackIcon w={8} h={5} /> Back
          </Button>
        </Box>
      ) : (
        <>
          <BackButton previous={previous} />
          <SchedulingProgressBar activeStep={3} totalSteps={4} />
        </>
      )}
      <Text
        textStyle="mobileHeader2"
        mt="1em"
        direction="row"
        display={{ md: "flex" }}
        mb="1em"
      >
        {isBeingEdited ? "Donation details" : "Confirm donation details"}
      </Text>
      <Box
        pl="0"
        align="left"
        mt="2rem"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        {authenticatedUser?.role === Role.DONOR ? (
          <Button
            pl="0"
            variant="edit"
            color="hubbard.100"
            onClick={() => go && go("date and time")}
          >
            Edit
          </Button>
        ) : (
          <Spacer />
        )}
        <Box>
          <Text textStyle="mobileHeader3">Date and time</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Proposed drop-off time
          </Text>
          <Text textStyle="mobileBody">{dateText(startDateLocal)}</Text>
          <Text textStyle="mobileBody">
            {`${startTimeLocal} - ${endTimeLocal}`}
          </Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Frequency
          </Text>
          <HStack spacing="4px">
            <Text
              textStyle="mobileBodyBold"
              color={`${(colorMap as any)[currentSchedule?.frequency]}.100`}
            >
              {currentSchedule.frequency}
            </Text>
            <Text>
              {currentSchedule.frequency === DonationFrequency.WEEKLY
                ? ` on ${dayText(startDateLocal)}s`
                : ""}
            </Text>
          </HStack>
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        {authenticatedUser?.role === Role.DONOR ? (
          <Button
            pl="0"
            variant="edit"
            color="hubbard.100"
            onClick={() => go && go("donation information")}
          >
            Edit
          </Button>
        ) : (
          <Spacer />
        )}
        <Box>
          <Text textStyle="mobileHeader3">Donation information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Size
          </Text>
          <Text textStyle="mobileBody">{`${currentSchedule.size} - ${description}`}</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Item category
          </Text>
          <Text textStyle="mobileBody">
            {currentSchedule.categories.join(", ")}
          </Text>
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        {authenticatedUser?.role === Role.DONOR ? (
          <Button
            pl="0"
            variant="edit"
            color="hubbard.100"
            onClick={() => go && go("volunteer information")}
          >
            Edit
          </Button>
        ) : (
          <Spacer />
        )}
        <Box>
          <Text textStyle="mobileHeader3">Volunteer information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Volunteer required
          </Text>
          <Text textStyle="mobileBody">
            {currentSchedule.volunteerNeeded ? "Yes" : "No"}
          </Text>
          {currentSchedule.volunteerNeeded && (
            <>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Assistance type
              </Text>
              <Text textStyle="mobileBody">
                Food rescue {currentSchedule.isPickup ? "pickup" : "unloading"}
              </Text>

              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Volunteer request time
              </Text>
              <Text textStyle="mobileBody">{dateText(startDateLocal)}</Text>
              <Text textStyle="mobileBody">
                {currentSchedule.volunteerTime
                  ? format(
                      parse(currentSchedule.volunteerTime, "HH:mm", new Date()),
                      "h:mm aa",
                    )
                  : "-"}
              </Text>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Address
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.isPickup
                  ? `${currentSchedule.pickupLocation}`
                  : "Community Fridge"}
              </Text>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Additional notes
              </Text>
              <Text textStyle="mobileBody">{currentSchedule.notes}</Text>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Assigned volunteer
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.volunteerId
                  ? `${currentVolunteer.firstName} ${currentVolunteer.lastName}`
                  : "-"}
              </Text>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Email
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.volunteerId
                  ? `${currentVolunteer.email}`
                  : "-"}
              </Text>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Phone
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.volunteerId
                  ? `${currentVolunteer.phoneNumber}`
                  : "-"}
              </Text>
            </>
          )}
        </Box>
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
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Phone
        </Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Organization
        </Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Box>
      {isBeingEdited && (
        <Box m="3em 0" pl="0" align="left">
          <Button
            mt="1.5rem"
            size="md"
            width={{ md: "20%", base: "100%" }}
            minWidth="210px"
            variant="deleteDonation"
            onClick={onOpen}
          >
            Cancel donation
          </Button>
          {currentSchedule.recurringDonationId === "null" ? (
            <GeneralDeleteShiftModal
              title="Cancel one-time donation"
              bodyText="Are you sure you want to cancel your donation? This will remove all
              linked occurences and notify all respective parties, including CFKW."
              buttonLabel="Cancel donation"
              isOpen={isOpen}
              onClose={onClose}
              onDelete={onDeleteClick}
            />
          ) : (
            <ModifyRecurringModal
              isOpen={isOpen}
              onClose={onClose}
              onModification={onDeleteClick}
              modificationType="delete"
            />
          )}
        </Box>
      )}
      {!isBeingEdited && (
        <HStack>
          <Flex justify="flex-start" w={{ lg: "default", base: "100%" }}>
            <Button
              onClick={onSubmitClick}
              variant="navigation"
              w={{ lg: "18%", base: "100%" }}
            >
              Submit
            </Button>
          </Flex>
          <ErrorSchedulingModal
            headerText="Donation could not be scheduled"
            bodyText=" Sorry, something went wrong with our system. Please try again."
            isOpen={isErrorSchedulingOpen}
            onClose={onErrorSchedulingClose}
          />
        </HStack>
      )}
    </Container>
  );
};

export default ConfirmDetails;
