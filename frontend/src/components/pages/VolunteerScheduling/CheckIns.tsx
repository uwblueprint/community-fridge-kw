import { Spinner, Text, Divider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "react-hooks-helper";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import { CheckInWithShiftType, ShiftType } from "../../../types/VolunteerTypes";
import ShiftCard from "../VolunteerDashboard/ShiftCard";

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
  }, []);

  if (!checkIns || checkIns === null) {
    return <Spinner />;
  }

  return (
    <>
      <Text pt="0.8rem" textStyle="mobileHeader3" color="black.100">
        Fridge check-in shifts{" "}
      </Text>
      <Text py="0.8rem" textStyle="mobileBody" color="hubbard.100">
        Checkin blurb w/ link.{" "}
      </Text>
      <Divider mt="1rem" />
      {checkIns.map((checkInObject: CheckInWithShiftType, id) => (
        <ShiftCard
          key={id}
          shift={checkInObject}
          setShiftId={setShiftId}
          navigation={navigation}
          isSignUp
          setIsFoodRescue={setIsFoodRescue}
        />
      ))}
    </>
  );
};

export default CheckIns;
