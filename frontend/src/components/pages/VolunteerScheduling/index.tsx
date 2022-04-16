import React, { useCallback, useState } from "react";
import { NavigationProps, Step, useStep } from "react-hooks-helper";

import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
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
  const [selectedShift, setSelectedShift] = useState<
    CheckInWithShiftType | ScheduleWithShiftType
  >({} as CheckInWithShiftType | ScheduleWithShiftType);

  const setShiftDetails = useCallback(
    (id: string, isFoodRescue: boolean) => {
      setShiftId(id);
      setShiftType(isFoodRescue ? ShiftType.SCHEDULING : ShiftType.CHECKIN);
    },
    [shiftId, shiftType],
  );

  const setSelectedVolunteerShift = useCallback(
    (shift: CheckInWithShiftType | ScheduleWithShiftType) =>
      setSelectedShift(shift),
    [setSelectedShift],
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
          setSelectedVolunteerShift={setSelectedVolunteerShift}
        />
      );
    case "thank you page":
      return <ThankYouVolunteer shift={selectedShift} />;
    default:
      return <></>;
  }
};

export default VolunteerScheduling;
