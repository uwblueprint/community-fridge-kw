import { Divider, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import { CheckInWithShiftType, ShiftType } from "../../../types/VolunteerTypes";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import CheckInCalendar from "./CheckInCalendar";

export interface ShiftProps {
  navigation: NavigationProps;
  setShiftId: React.Dispatch<string>;
  setIsFoodRescue: React.Dispatch<boolean>;
}

const CheckIns = ({
  navigation,
  setShiftId,
  setIsFoodRescue,
}: ShiftProps): JSX.Element => {
  // const { isMobile } = useViewport();
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
    setIsFoodRescue(false);

    console.log(checkIns);
  }, []);

  if (!checkIns || checkIns === null) {
    console.log("here");
    return <Spinner />;
  }
  return (
    <>
      <FridgeCheckInDescription />
      <Divider mt="1rem" />
      <CheckInCalendar
        isAdminView={false}
        checkIns={checkIns}
        setShiftId={setShiftId}
        navigation={navigation}
        setIsFoodRescue={setIsFoodRescue}
      />
    </>
  );
};

export default CheckIns;
