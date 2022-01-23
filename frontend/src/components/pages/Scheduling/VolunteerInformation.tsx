import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import BackButton from "./BackButton";
import ErrorMessages from "./ErrorMessages";
import NextButton from "./NextButton";
import { SchedulingStepProps } from "./types";

const VolunteerInformation = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next, go } = navigation;

  const {
    id,
    startTime,
    endTime,
    frequency,
    volunteerNeeded,
    volunteerTime,
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
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [showAdditionalNotes, setShowAdditionalNotes] = useState<boolean>(
    false,
  );
  const [showTime, setShowTime] = useState<boolean>(false);

  const volunteerNeededValues = ["Yes", "No"];
  const volunteerAssistanceValues = [
    "Pick up (food rescue)",
    "Unloading (on-site)",
  ];
  const volunteerRequiredHelperText =
    "A volunteer is a community fridge member who will assist with donation drop-offs. Information of the volunteer assigned will be provided.";

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
    if (volunteerNeeded && isPickup === undefined) {
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

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }
    await SchedulingAPIClient.updateSchedule(id, formValues);
    if (go !== undefined) {
      go("confirm donation details");
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  return (
    <Container variant="responsiveContainer">
      <BackButton
        isBeingEdited={isBeingEdited}
        onSaveClick={onSaveClick}
        previous={previous}
      />
      <SchedulingProgressBar activeStep={2} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em">
        Volunteer Information
      </Text>
      <Box
        p="2em"
        bg="cottonCandy.100"
        align="left"
        m="2em 0 3em"
        borderRadius="5px"
        maxWidth="500px"
      >
        <Text textStyle="mobileHeader4">Proposed Drop-off Time</Text>
        <Text textStyle="mobileBody">
          {format(new Date(startTime), "EEEE, MMMM d")}
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
          setShowAdditionalNotes(e === "No");
          setCanSubmit(e === "No");
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
              setShowAdditionalNotes(e === volunteerAssistanceValues[1]);
              setShowTime(e === volunteerAssistanceValues[1]);
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
                value={pickupLocation}
                onChange={(e) => {
                  handleChange(e.target.value, "pickupLocation");
                  setShowTime(e.target.value !== "");
                }}
                placeholder="Enter location"
                size="lg"
                maxWidth="740px"
              />
              <FormErrorMessage>{formErrors.pickupLocation}</FormErrorMessage>
            </FormControl>
          )}
          {showTime && (
            <FormControl
              isRequired
              isInvalid={!!formErrors.volunteerTime}
              m="3em 0"
            >
              <FormLabel>
                What is the specific time you require assistance?
              </FormLabel>
              <Input
                value={volunteerTime}
                type="time"
                onChange={(e) => {
                  handleChange(e.target.value, "volunteerTime");
                  setShowAdditionalNotes(true);
                  setCanSubmit(true);
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
      {showAdditionalNotes && (
        <FormControl m="3em 0">
          <FormLabel>Additional notes</FormLabel>
          <FormHelperText mb="1em">
            Any notes added will be visible to admin.
          </FormHelperText>
          <Textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value, "notes")}
            placeholder="Add any information about pick-up, drop-off, or any comments for Admin."
            maxWidth="740px"
          />
        </FormControl>
      )}
      <NextButton
        isBeingEdited={isBeingEdited}
        go={go}
        canSubmit={canSubmit}
        handleNext={handleNext}
      />
    </Container>
  );
};

export default VolunteerInformation;
