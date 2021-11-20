import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import ConfirmDetails from "./ConfirmDetails";
import DonationInformation from "./DonationInformation";
import GetStarted from "./GetStarted";
import SelectDateTime from "./SelectDateTime";
import { SchedulingFormProps } from "./types";
import VolunteerInformation from "./VolunteerInformation";

const steps = [
  {
    id: "get started scheduling",
  },
  {
    id: "date and time",
  },
  {
    id: "donation information",
  },
  {
    id: "volunteer information",
  },
  {
    id: "confirm donation details",
  },
];

interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

interface SchedulingProps {
  schedulingData: SchedulingFormProps;
  isBeingEdited: boolean;
}

const Scheduling = () => {
  const [schedulingFormValues, setSchedulingForm] = useForm({
    id: "",
    donorId: "",
    categories: [],
    size: "",
    isPickup: false,
    pickupLocation: "",
    daypart: "",
    startTime: new Date().toDateString(),
    endTime: new Date().toDateString(),
    status: "",
    volunteerNeeded: false,
    frequency: "",
    notes: "",
  });

const schedulingDefaultData = {
  id: "",
  donorId: "",
  categories: [],
  size: "",
  isPickup: false,
  pickupLocation: "",
  startTime: new Date().toDateString(),
  endTime: new Date().toDateString(),
  status: "",
  volunteerNeeded: false,
  volunteerIds: [],
  frequency: "",
  notes: "",
};

const Scheduling = ({
  schedulingData = schedulingDefaultData,
  isBeingEdited = false,
}: SchedulingProps) => {
  const [schedulingFormValues, setSchedulingForm] = useForm(schedulingData);
  const { step, navigation }: UseStepType = useStep({
    steps,
    initialStep: isBeingEdited ? 4 : 0,
  });
  const { id } = step;

  switch (id) {
    case "get started scheduling":
      return (
        <GetStarted
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
        />
      );
    case "date and time":
      return (
        <SelectDateTime
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
          isBeingEdited={isBeingEdited}
        />
      );
    case "donation information":
      return (
        <DonationInformation
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
          isBeingEdited={isBeingEdited}
        />
      );
    case "volunteer information":
      return (
        <VolunteerInformation
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
          isBeingEdited={isBeingEdited}
        />
      );
    case "confirm donation details":
      return (
        <ConfirmDetails
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
          isBeingEdited={isBeingEdited}
        />
      );
    default:
      return null;
  }
};

export default Scheduling;
