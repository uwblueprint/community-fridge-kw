import React, { useCallback, useState } from "react";
import { NavigationProps, Step, useStep } from "react-hooks-helper";

import { ShiftType } from "../../../types/VolunteerTypes";
import ConfirmShiftDetails from "./ConfirmShiftDetails";
import ThankYouVolunteer from "./ThankYouVolunteer";
import VolunteerShiftsTabs from "./VolunteerShiftTabs";

const steps = [
  {
    id: "shifts tab",
  },
  {
    id: "confirm shift sign up",
  },
  {
    id: "thank you page",
  },
];

interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

const VolunteerScheduling = () => {
  const [shiftId, setShiftId] = useState<string>("1");
  const [shiftType, setShiftType] = useState<ShiftType>(ShiftType.CHECKIN);

  const setShiftDetails = useCallback(
    (id: string, isFoodRescue: boolean) => {
      setShiftId(id);
      setShiftType(isFoodRescue ? ShiftType.SCHEDULING : ShiftType.CHECKIN);
    },
    [shiftId, shiftType],
  );

  const { step, navigation }: UseStepType = useStep({
    steps,
    initialStep: 0,
  });
  const { id } = step;

  switch (id) {
    case "shifts tab":
      return (
        <VolunteerShiftsTabs
          navigation={navigation}
          setShiftDetails={setShiftDetails}
        />
      );
    case "confirm shift sign up":
      return (
        <ConfirmShiftDetails
          navigation={navigation}
          shiftId={shiftId}
          shiftType={shiftType}
        />
      );
    case "thank you page":
      return <ThankYouVolunteer shiftId={shiftId} shiftType={shiftType} />;
    default:
      return <></>;
  }
};

export default VolunteerScheduling;
