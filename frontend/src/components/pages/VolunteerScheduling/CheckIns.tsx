import { Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps } from "react-hooks-helper";
import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import { CheckInWithShiftType, ShiftType } from "../../../types/VolunteerTypes";
import ShiftCard from "../VolunteerDashboard/ShiftCard";

const CheckIns = (
  {
    navigation,
    setShiftId,
    setIsFoodRescue,
  }:  {
    navigation: NavigationProps;
    setShiftId: any;
    setIsFoodRescue: any;
  }
): JSX.Element => {
  
  const [checkIns, setCheckIns] = useState<CheckInWithShiftType[]>([]);
  React.useEffect(() => {
    const getCheckIns = async () => {
      const checkInResponse: CheckInWithShiftType[] = await (
        await CheckInAPIClient.getAllCheckIns()
      ).map((checkin) => ({ ...checkin, type: ShiftType.CHECKIN }));
      console.log("checkin first", checkInResponse);
      const needVolunteerCheckIns = checkInResponse.filter(checkin => !checkin.volunteerId);
      setCheckIns(needVolunteerCheckIns);
      console.log("checkins", needVolunteerCheckIns);
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
      {checkIns.map((checkInObject: CheckInWithShiftType, id) => (
        <ShiftCard
          key={id}
          shift={checkInObject}
          setShiftId={setShiftId}
          navigation={navigation}
          isSignUp
        />
      ))}
    </>
  );
};

export default CheckIns;
