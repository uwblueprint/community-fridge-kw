import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

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
  const [formValues, setForm] = useForm({
    category: "",
    quantity: 0,
    size: "",
    pickup_location: "",
    start_time: new Date("December 17, 1995 03:24:00"),
    end_time: new Date("December 17, 1995 03:24:00"),
    status: "",
    volunteers_needed: 0,
    notes: "",
  });

  const { step, navigation }: UseStepType = useStep({ steps, initialStep: 0 });
  const { id } = step;

  switch (id) {
    case "get started scheduling":
      return (
        <GetStarted
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "date and time":
      return (
        <SelectDateTime
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "donation information":
      return (
        <DonationInformation
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "volunteer information":
      return (
        <VolunteerInformation
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "confirm donation details":
      return (
        <ConfirmDetails
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    default:
      return null;
  }
};

export default Scheduling;
