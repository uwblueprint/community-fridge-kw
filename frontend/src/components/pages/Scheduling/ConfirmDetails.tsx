import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { colorMap } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import ErrorSchedulingModal from "../../common/GeneralErrorModal";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import DeleteScheduleModal from "../Dashboard/components/DeleteScheduleModal";
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
  }, [currentSchedule.id]);
  return (
    <Container variant="responsiveContainer">
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
        {isBeingEdited ? "Donation Details" : "Confirm Donation Details"}
        &nbsp;&nbsp;&nbsp;
        <Badge
          borderRadius="11px"
          px="18px"
          py="-5px"
          ml={{ md: "5px" }}
          color={`${(colorMap as any)[currentSchedule?.frequency]}.100`}
          backgroundColor={`${
            (colorMap as any)[currentSchedule?.frequency]
          }.50`}
        >
          {currentSchedule?.frequency}
        </Badge>
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
        <Button
          pl="0"
          variant="edit"
          color="hubbard.100"
          onClick={() => go && go("date and time")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader3">Drop-off Information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Proposed Drop-off Time
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
        <Button
          pl="0"
          variant="edit"
          color="hubbard.100"
          onClick={() => go && go("donation information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader3">Donation Information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Size
          </Text>
          <Text textStyle="mobileBody">{`${currentSchedule.size} - ${description}`}</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Item Category
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
        <Button
          pl="0"
          variant="edit"
          color="hubbard.100"
          onClick={() => go && go("volunteer information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader3">Volunteer Information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Volunteer Needed
          </Text>
          <Text textStyle="mobileBody">
            {currentSchedule.volunteerNeeded ? "Yes" : "No"}
          </Text>
          {currentSchedule.volunteerNeeded && (
            <>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Pickup Needed
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.isPickup ? "Yes" : "No"}
              </Text>
            </>
          )}

          {currentSchedule.volunteerNeeded && currentSchedule.isPickup && (
            <Box>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Address
              </Text>
              <Text textStyle="mobileBody">
                {currentSchedule.pickupLocation}
              </Text>
            </Box>
          )}
          <Box>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Additional notes
            </Text>
            <Text textStyle="mobileBody">{currentSchedule.notes}</Text>
          </Box>
        </Box>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Donor Information</Text>
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
            size="lg"
            width={{ lg: "30%", base: "100%" }}
            variant="deleteDonation"
            onClick={onOpen}
          >
            Cancel donation
          </Button>
          {currentSchedule.recurringDonationId === "null" ? (
            <DeleteScheduleModal
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
          <Flex justify="flex-end">
            <Button onClick={onSubmitClick} variant="navigation">
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
