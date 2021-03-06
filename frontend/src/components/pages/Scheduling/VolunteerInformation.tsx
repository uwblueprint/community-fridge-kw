import {
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ModifyRecurringDonationModal from "../Dashboard/components/ModifyRecurringDonationModal";
import BackButton from "./BackButton";
import CancelButton from "./CancelEditsButton";
import ErrorMessages from "./ErrorMessages";
import NextButton from "./NextButton";
import SaveButton from "./SaveChangesButton";
import { SchedulingStepProps } from "./types";

const VolunteerInformation = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next, go } = navigation;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    id,
    recurringDonationId,
    startTime,
    endTime,
    frequency,
    volunteerNeeded,
    volunteerTime,
    volunteerId,
    pickupLocation,
    isPickup,
    notes,
  } = formValues;

  const [formErrors, setFormErrors] = useState({
    volunteerNeeded: "",
    volunteerTime: "",
    pickupLocation: "",
    isPickup: "",
  });

  const toast = useToast();

  const volunteerNeededValues = ["Yes", "No"];
  const volunteerAssistanceValues = [
    "Pickup (off-site)",
    "Unloading (on-site)",
  ];
  const volunteerRequiredHelperText =
    "A volunteer is a community fridge member who will assist with donation drop-offs. Information of the volunteer assigned will be provided.";

  const getSubmitState = () => {
    if (volunteerNeeded === null || volunteerNeeded === undefined) {
      return false;
    }

    if (volunteerNeeded && isPickup) {
      return !!pickupLocation && !!volunteerTime;
    }

    return volunteerNeeded ? !!volunteerTime : true;
  };

  const handleChange = (e: boolean | string, name: string) => {
    setForm({ target: { name, value: e } });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const volunteerNeededRadioValue = () => {
    if (volunteerNeeded !== null && volunteerNeeded !== undefined) {
      return volunteerNeeded ? "Yes" : "No";
    }
    return "";
  };

  const isPickupRadioValue = () => {
    if (isPickup !== null && isPickup !== undefined) {
      return isPickup
        ? volunteerAssistanceValues[0]
        : volunteerAssistanceValues[1];
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      volunteerNeeded: "",
      volunteerTime: "",
      pickupLocation: "",
      isPickup: "",
    };
    let valid = true;

    if (volunteerNeeded === undefined) {
      valid = false;
      newErrors.volunteerNeeded = ErrorMessages.requiredField;
    }
    if (volunteerNeeded && (isPickup === undefined || isPickup === null)) {
      valid = false;
      newErrors.isPickup = ErrorMessages.requiredField;
    }
    if (volunteerNeeded && !volunteerTime) {
      valid = false;
      newErrors.volunteerTime = ErrorMessages.requiredField;
    }
    if (volunteerNeeded && isPickup && !pickupLocation) {
      valid = false;
      newErrors.pickupLocation = ErrorMessages.requiredField;
    }
    setFormErrors(newErrors);
    return valid;
  };

  const discardChanges = async () => {
    const scheduleResponse = await SchedulingAPIClient.getScheduleById(id);
    setForm({
      target: {
        name: "volunteerNeeded",
        value: scheduleResponse.volunteerNeeded,
      },
    });
    setForm({
      target: { name: "volunteerTime", value: scheduleResponse.volunteerTime },
    });
    setForm({
      target: {
        name: "pickupLocation",
        value: scheduleResponse.pickupLocation,
      },
    });
    setForm({ target: { name: "isPickup", value: scheduleResponse.isPickup } });
    setForm({ target: { name: "notes", value: scheduleResponse.notes } });

    return go && go("confirm donation details");
  };

  const onSaveRecurringClick = () => {
    if (!validateForm()) {
      return;
    }
    onOpen();
  };

  const onSaveClick = async (isOneTimeEvent = true) => {
    if (!validateForm()) {
      return;
    }
    const editedFields = {
      volunteerNeeded,
      volunteerTime: volunteerNeeded ? volunteerTime : null,
      volunteerId: volunteerNeeded ? volunteerId : null,
      pickupLocation: volunteerNeeded && isPickup ? pickupLocation : null,
      isPickup: volunteerNeeded ? isPickup : null,
      notes,
      startTime,
    };

    const res = isOneTimeEvent
      ? await SchedulingAPIClient.updateSchedule(id, editedFields)
      : await SchedulingAPIClient.updateSchedulesByRecurringDonationId(
          recurringDonationId,
          editedFields,
        );

    if (!res) {
      toast({
        title: "Volunteer information could not be updated. Please try again",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Volunteer information updated successfully",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    discardChanges();
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  return (
    <Container variant="responsiveContainer" pb={{ lg: "0px", base: "100px" }}>
      {isBeingEdited ? (
        <CancelButton discardChanges={discardChanges} />
      ) : (
        <>
          <SchedulingProgressBar activeStep={2} totalSteps={4} />
          <BackButton previous={previous} />
        </>
      )}
      <Text textStyle="mobileHeader2" mt="2em">
        Volunteer information
      </Text>
      <Box
        p="2em"
        bg="cottonCandy.100"
        align="left"
        m="2em 0 3em"
        borderRadius="5px"
        maxWidth="500px"
      >
        <Text textStyle="mobileHeader4">Proposed drop-off time</Text>
        <Text textStyle="mobileBody">
          {format(new Date(startTime), "EEEE MMMM d")}
        </Text>
        <Text textStyle="mobileBody">
          {format(new Date(startTime), "h:mm aa")}-
          {format(new Date(endTime), "h:mm aa")}
        </Text>
        <Text textStyle="mobileBody">{frequency}</Text>
      </Box>
      <RadioSelectGroup
        name="volunteer-required"
        label="Do you require a volunteer?"
        value={volunteerNeededRadioValue()}
        values={volunteerNeededValues}
        icons={[]}
        isRequired
        error={formErrors.volunteerNeeded}
        helperText={volunteerRequiredHelperText}
        onChange={(e: string) => {
          handleChange(e === "Yes", "volunteerNeeded");
        }}
      />
      {volunteerNeeded && (
        <>
          <RadioSelectGroup
            name="is-pickup"
            label="What type of assistance is required?"
            value={isPickupRadioValue()}
            values={volunteerAssistanceValues}
            icons={[]}
            isRequired
            error={formErrors.isPickup}
            onChange={(e: string) => {
              handleChange(e === volunteerAssistanceValues[0], "isPickup");
            }}
          />
          {isPickup && (
            <FormControl
              isRequired
              isInvalid={!!formErrors.pickupLocation}
              m="3em 0"
            >
              <FormLabel>Pickup location:</FormLabel>
              <Input
                value={pickupLocation!}
                onChange={(e) => {
                  handleChange(e.target.value, "pickupLocation");
                }}
                placeholder="Enter location"
                size="lg"
                maxWidth="740px"
              />
              <FormErrorMessage>{formErrors.pickupLocation}</FormErrorMessage>
            </FormControl>
          )}
          {(!!pickupLocation || (!isPickup && isPickup !== undefined)) && (
            <FormControl
              isRequired
              isInvalid={!!formErrors.volunteerTime}
              m="3em 0"
            >
              <FormLabel>
                What is the specific time you require assistance?
              </FormLabel>
              <Input
                value={volunteerTime!}
                type="time"
                onChange={(e) => {
                  handleChange(e.target.value, "volunteerTime");
                }}
                placeholder="Enter time"
                size="lg"
                maxWidth="740px"
              />
              <FormErrorMessage>{formErrors.volunteerTime}</FormErrorMessage>
            </FormControl>
          )}
        </>
      )}

      {((!volunteerNeeded && volunteerNeeded !== undefined) ||
        !!volunteerTime) && (
        <FormControl m="3em 0">
          <FormLabel>Additional notes</FormLabel>
          <FormHelperText mb="1em">
            Any notes added will be visible to admin.
          </FormHelperText>
          <Textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value, "notes")}
            placeholder="Add any information about pick-up, drop-off, or any comments for admin."
            maxWidth="740px"
          />
        </FormControl>
      )}
      {isBeingEdited ? (
        <>
          {formValues.recurringDonationId !== "null" ? (
            <>
              <SaveButton onSaveClick={onSaveRecurringClick} />
              <ModifyRecurringDonationModal
                isOpen={isOpen}
                onClose={onClose}
                onModification={onSaveClick}
                modificationType="update"
              />
            </>
          ) : (
            <SaveButton onSaveClick={onSaveClick} />
          )}
        </>
      ) : (
        <NextButton canSubmit={getSubmitState()} handleNext={handleNext} />
      )}
    </Container>
  );
};

export default VolunteerInformation;
