import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { SchedulingStepProps } from "./types";

const VolunteerInformation = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const history = useHistory();
  const {
    startTime,
    endTime,
    frequency,
    volunteerNeeded,
    volunteerTime,
    pickupLocation,
    isPickup,
    notes,
  } = formValues;

  const volunteerNeededValues = ["Yes", "No"];
  const volunteerAssistanceValues = [
    "Pickup (food rescue)",
    "Unloading (on site)",
  ];
  const volunteerRequiredHelperText =
    "A volunteer is a community fridge member who will assist with donation dropoffs. Information of the volunteer assigned will be provided.";

  const handleChange = (e: boolean | string, name: string) => {
    setForm({ target: { name, value: e } });
  };

  const volunteerNeededRadioValue = () => {
    if (volunteerNeeded !== null) {
      return volunteerNeeded ? "Yes" : "No";
    }
    return "";
  }

  const isPickupRadioValue = () => {
    if (isPickup !== null) {
      return isPickup ? volunteerAssistanceValues[0] : volunteerAssistanceValues[1];
    }
    return "";
  }

  return (
    <Container p="30px">
      <SchedulingProgressBar activeStep={2} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em">
        Volunteer Information
      </Text>
      <Box
        p="1.5em"
        bg="squash.100"
        align="left"
        m="2em 0 3em"
        borderWidth="1px"
        borderColor="#6C6C84"
        borderRadius="5px"
      >
        <Text textStyle="mobileHeader4">Proposed dropoff time</Text>
        <Text textStyle="mobileBody">{new Date(startTime).toDateString()}</Text>
        <Text textStyle="mobileBody">
          {new Date(startTime).toLocaleTimeString()}-
          {new Date(endTime).toLocaleTimeString()}
        </Text>
        <Text textStyle="mobileBody">{frequency}</Text>
      </Box>
      <RadioSelectGroup
        name="volunteer-required"
        label="Do you require a volunteer?"
        value={volunteerNeededRadioValue()}
        values={volunteerNeededValues}
        isRequired
        helperText={volunteerRequiredHelperText}
        onChange={(e: string) => {
          handleChange(e === "Yes", "volunteerNeeded");
        }}
      />
      <br />
      <br />
      {volunteerNeeded &&
        <>
        <RadioSelectGroup
          name="is-pickup"
          label="What do you require volunteer assistance for?"
          value={isPickupRadioValue()}
          values={volunteerAssistanceValues}
          isRequired
          onChange={(e: string) => {
            handleChange(e === volunteerAssistanceValues[0], "isPickup");
          }}
        />
        {isPickup &&
          <FormControl isRequired m="3em 0">
            <FormLabel>Pickup location:</FormLabel>
            <Input
              value={pickupLocation}
              onChange={(e) => handleChange(e.target.value, "pickupLocation")}
              placeholder="Enter location"
              size="lg"
            />
          </FormControl>
        }
        <FormControl isRequired m="3em 0">
          <FormLabel>What is the specific time you require assistance?</FormLabel>
          <Input
            value={volunteerTime}
            onChange={(e) => handleChange(e.target.value, "volunteerTime")}
            placeholder="Enter time"
            size="lg"
          />
        </FormControl>
        </>
      }
      <FormControl m="3em 0">
        <FormLabel>Additional notes</FormLabel>
        <FormHelperText mb="1em">
          Any notes added will be visible to admin.
        </FormHelperText>
        <Textarea
          value={notes}
          onChange={(e) => handleChange(e.target.value, "notes")}
          placeholder="john@shawarmaplus.com"
        />
      </FormControl>
      <HStack>
        <Button onClick={previous} variant="navigation">
          Back
        </Button>
        <Button onClick={next} variant="navigation">
          Next
        </Button>
      </HStack>
    </Container>
  );
};

export default VolunteerInformation;
