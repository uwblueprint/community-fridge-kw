import { Divider, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import CheckInCalendar from "./CheckInCalendar";

export interface ShiftProps {
  navigation: NavigationProps;
  setSelectedVolunteerShift: (
    shift: ScheduleWithShiftType | CheckInWithShiftType,
  ) => void;
}

const CheckIns = ({
  navigation,
  setSelectedVolunteerShift,
}: ShiftProps): JSX.Element => {
  const [checkIns, setCheckIns] = useState<CheckInWithShiftType[]>([]);

  useEffect(() => {
    const getCheckIns = async () => {
      const checkInResponse: CheckInWithShiftType[] = await (
        await CheckInAPIClient.getAllCheckIns()
      ).map((checkin) => ({ ...checkin, type: ShiftType.CHECKIN }));
      const needVolunteerCheckIns = checkInResponse.filter(
        (checkin) => !checkin.volunteerId,
      );
      setCheckIns(needVolunteerCheckIns);
    };
    getCheckIns();
  }, []);

  if (!checkIns || checkIns === null) {
    return <Spinner />;
  }

  return (
    <>
      <FridgeCheckInDescription />
      <Divider mt="1.5rem" mb="2rem" />
      <CheckInCalendar
        checkIns={checkIns}
        navigation={navigation}
        setSelectedVolunteerShift={setSelectedVolunteerShift}
      />
    </>
  );
};

export default CheckIns;
