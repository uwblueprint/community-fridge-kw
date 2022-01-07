import React, { useEffect } from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import { Schedule } from "../../../types/SchedulingTypes";
import ConfirmDetails from "./ConfirmDetails";
import DonationInformation from "./DonationInformation";
import GetStarted from "./GetStarted";
import SelectDateTime from "./SelectDateTime";
import ThankYou from "./ThankYou";
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
  {
    id: "thank you page",
  },
];

interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

interface SchedulingProps {
  schedulingData: Schedule;
  isBeingEdited: boolean;
}

const schedulingDefaultData = ({
  id: "",
  donorId: "",
  categories: [],
  size: "",
  dayPart: "",
  startTime: "",
  endTime: "",
  volunteerIds: [],
  frequency: "",
  notes: "",
} as unknown) as Schedule;

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

  // Scroll to top of page at each step in flow
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    case "thank you page":
      return (
        <ThankYou
          formValues={schedulingFormValues}
          setForm={setSchedulingForm}
          navigation={navigation}
          isBeingEdited={isBeingEdited}
        />
      );
    default:
      return <></>;
  }
};

export default Scheduling;
