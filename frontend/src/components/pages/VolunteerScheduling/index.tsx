import React, { useCallback, useContext, useState } from "react";
import { NavigationProps, Step, useStep } from "react-hooks-helper";

import VolunteerContext from "../../../contexts/VolunteerContext";
import { Status } from "../../../types/AuthTypes";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
} from "../../../types/VolunteerTypes";
import PendingPage from "../VolunteerDashboard/PendingPage";
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
  const { volunteerStatus } = useContext(VolunteerContext);
  const [selectedShift, setSelectedShift] = useState<
    CheckInWithShiftType | ScheduleWithShiftType
  >({} as CheckInWithShiftType | ScheduleWithShiftType);

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
        <>
          {volunteerStatus === Status.APPROVED ? (
            <VolunteerShiftsTabs
              navigation={navigation}
              setSelectedVolunteerShift={setSelectedVolunteerShift}
            />
          ) : (
            <PendingPage />
          )}
        </>
      );
    case "confirm shift sign up":
      return (
        <ConfirmShiftDetails navigation={navigation} shift={selectedShift} />
      );
    case "thank you page":
      return <ThankYouVolunteer shift={selectedShift} />;
    default:
      return <></>;
  }
};

export default VolunteerScheduling;
