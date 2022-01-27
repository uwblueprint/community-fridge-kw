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
import { add, differenceInDays, format, isBefore } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { colorMap } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import DeleteRecurringModal from "../Dashboard/components/DeleteRecurringModal";
import DeleteScheduleModal from "../Dashboard/components/DeleteScheduleModal";
import BackButton from "./BackButton";
import SaveButton from "./SaveChangesButton";
import ErrorSchedulingModal from "../Dashboard/components/ErrorSchedulingModal";
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
    if (isOneTimeEvent) {
      await SchedulingAPIClient.deleteSchedule(currentSchedule.id);
    } else {
      await SchedulingAPIClient.deleteScheduleByRecurringId(
        currentSchedule?.recurringDonationId,
        currentSchedule.startTime,
      );
    }
    toast({
      title: isOneTimeEvent
        ? "Donation cancelled successfully"
        : "Donations cancelled successfully",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    history.push(
      authenticatedUser!.role === Role.DONOR
        ? `${Routes.DASHBOARD_PAGE}`
        : `${Routes.VIEW_DONATIONS}`,
    );
  };

  const getDonorData = async () => {
    const donorResponse = isBeingEdited
      ? await DonorAPIClient.getDonorByUserId(currentSchedule.donorId)
      : await DonorAPIClient.getDonorById(authenticatedUser!.id);
    setForm({ target: { name: "donorId", value: donorResponse.id } });
    setCurrentDonor(donorResponse);
  };

  const startDateLocal = new Date(currentSchedule.startTime);
  const endDateLocal = new Date(currentSchedule.recurringDonationEndDate);
  const startTimeLocal = format(new Date(currentSchedule.startTime), "h:mm aa");
  const endTimeLocal = format(new Date(currentSchedule.endTime), "h:mm aa");

  const dayText = (startDate: Date) => {
    return format(startDate, "eeee");
  };
  const dateText = (startDate: Date) => {
    return format(startDate, "MMMM d, yyyy");
  };

  const nextDropoffDateText = (startDate: Date) => {
    let addOptions = {};
    switch (currentSchedule.frequency) {
      case DonationFrequency.WEEKLY:
        addOptions = { weeks: 1 };
        break;
      case DonationFrequency.DAILY:
        addOptions = { days: 1 };
        break;
      case DonationFrequency.MONTHLY:
        addOptions = { months: 1 };
        break;
      default:
        break;
    }
    const result = add(startDate, addOptions);
    if (
      differenceInDays(endDateLocal, result) >= 0 &&
      isBefore(result, endDateLocal)
    ) {
      return dateText(result);
    }
    return null;
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
                authenticatedUser?.role === Role.DONOR
                  ? Routes.DASHBOARD_PAGE
                  : Routes.VIEW_DONATIONS,
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
          disabled={authenticatedUser?.role !== Role.DONOR}
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

          {nextDropoffDateText(startDateLocal) === null ||
          currentSchedule.frequency === DonationFrequency.ONE_TIME ? null : (
            <Box>
              <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
                Next Drop-Off
              </Text>
              <Text textStyle="mobileBody">
                {nextDropoffDateText(startDateLocal)}
              </Text>
              <Text textStyle="mobileBody">
                {`${startTimeLocal} - ${endTimeLocal}`}
              </Text>{" "}
            </Box>
          )}
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
          disabled={authenticatedUser?.role !== Role.DONOR}
          onClick={() => go && go("volunteer information")}
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
          disabled={authenticatedUser?.role !== Role.DONOR}
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
          <Text textStyle="mobileHeader3" pb="0.8em">
            Danger Zone
          </Text>
          <Text textStyle="mobileBody">
            To cancel this schedule donation, click below.
          </Text>
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
            <DeleteRecurringModal
              isOpen={isOpen}
              onClose={onClose}
              onDelete={onDeleteClick}
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
            isOpen={isErrorSchedulingOpen}
            onClose={onErrorSchedulingClose}
          />
        </HStack>
      )}
    </Container>
  );
};

export default ConfirmDetails;
