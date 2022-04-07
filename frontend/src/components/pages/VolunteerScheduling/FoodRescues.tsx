import { Divider, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import {
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import ShiftCard from "../VolunteerDashboard/ShiftCard";
import { ShiftProps } from "./CheckIns";

const FoodRescues = ({
  navigation,
  setShiftId,
  setIsFoodRescue,
}: ShiftProps): JSX.Element => {
  const [foodRescues, setFoodRescues] = useState<ScheduleWithShiftType[]>([]);

  useEffect(() => {
    const getFoodRescues = async () => {
      const scheduleResponse: ScheduleWithShiftType[] = await (
        await SchedulingAPIClient.getAllSchedulesThatNeedVolunteers(false)
      ).map((scheduling) => ({ ...scheduling, type: ShiftType.SCHEDULING }));
      setFoodRescues(scheduleResponse);
    };

    getFoodRescues();
    setIsFoodRescue(true);
  }, []);

  if (!foodRescues || foodRescues === null) {
    return <Spinner />;
  }

  return (
    <>
      <Text pt="0.8rem" textStyle="mobileHeader3" color="black.100">
        Food rescue shifts{" "}
      </Text>
      <Text py="0.8rem" textStyle="mobileBody" color="hubbard.100">
        Food rescue shifts are picking up food from donors and helping bring
        them to the fridge.{" "}
      </Text>
      <Divider mt="1rem" />
      {foodRescues.map((scheduleObject: ScheduleWithShiftType, id) => (
        <ShiftCard
          key={id}
          shift={scheduleObject}
          setShiftId={setShiftId}
          navigation={navigation}
          isSignUp
          setIsFoodRescue={setIsFoodRescue}
        />
      ))}
    </>
  );
};

export default FoodRescues;
