import { Divider, Spinner, StackDivider, VStack } from "@chakra-ui/react";
import isAfter from "date-fns/isAfter";
import React, { useEffect, useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import {
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import FridgeFoodRescueDescription from "../../common/FridgeFoodRescueDescription";
import ShiftCard from "../VolunteerDashboard/ShiftCard";
import { ShiftProps } from "./CheckIns";

const FoodRescues = ({
  navigation,
  setSelectedVolunteerShift,
}: ShiftProps): JSX.Element => {
  const [foodRescues, setFoodRescues] = useState<ScheduleWithShiftType[]>([]);

  useEffect(() => {
    const getFoodRescues = async () => {
      const scheduleResponse: ScheduleWithShiftType[] = await (
        await SchedulingAPIClient.getAllSchedulesThatNeedVolunteers(false)
      )
        .filter((scheduling) =>
          isAfter(new Date(scheduling.startTime), new Date()),
        )
        .map((scheduling) => ({ ...scheduling, type: ShiftType.SCHEDULING }));
      setFoodRescues(scheduleResponse);
    };

    getFoodRescues();
  }, []);

  if (!foodRescues || foodRescues === null) {
    return <Spinner />;
  }

  return (
    <>
      <FridgeFoodRescueDescription />
      <Divider mt="1.5rem" />
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        marginTop={["10px", "40px"]}
      >
        {foodRescues.map((scheduleObject: ScheduleWithShiftType, id) => (
          <ShiftCard
            key={id}
            shift={scheduleObject}
            setSelectedVolunteerShift={setSelectedVolunteerShift}
            navigation={navigation}
            isSignUp
          />
        ))}
      </VStack>
    </>
  );
};

export default FoodRescues;
