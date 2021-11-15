import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import Header from "../../common/Header";
import ConfirmDetails from "./ConfirmDetails";
import DonationInformation from "./DonationInformation";
import GetStarted from "./GetStarted";
import SelectDateTime from "./SelectDateTime";
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

const Scheduling = () => {
  const [schedulingFormValues, setSchedulingForm] = useForm({
    categories: [],
    size: "",
    isPickup: false,
    pickupLocation: "",
    startTime: new Date().toDateString(),
    endTime: new Date().toDateString(),
    status: "",
    volunteerNeeded: false,
    frequency: "",
    notes: "",
  });

  const { step, navigation }: UseStepType = useStep({ steps, initialStep: 0 });
  const { id } = step;

  switch (id) {
    case "get started scheduling":
      return (
        <>
          <Header />
          <GetStarted
            formValues={schedulingFormValues}
            setForm={setSchedulingForm}
            navigation={navigation}
          />
        </>
      );
    case "date and time":
      return (
        <>
          <Header />
          <SelectDateTime
            formValues={schedulingFormValues}
            setForm={setSchedulingForm}
            navigation={navigation}
          />
        </>
      );
    case "donation information":
      return (
        <>
          <Header />
          <DonationInformation
            formValues={schedulingFormValues}
            setForm={setSchedulingForm}
            navigation={navigation}
          />
        </>
      );
    case "volunteer information":
      return (
        <>
          <Header />
          <VolunteerInformation
            formValues={schedulingFormValues}
            setForm={setSchedulingForm}
            navigation={navigation}
          />
        </>
      );
    case "confirm donation details":
      return (
        <>
          <Header />
          <ConfirmDetails
            formValues={schedulingFormValues}
            setForm={setSchedulingForm}
            navigation={navigation}
          />
        </>
      );
    default:
      return null;
  }
};

export default Scheduling;
