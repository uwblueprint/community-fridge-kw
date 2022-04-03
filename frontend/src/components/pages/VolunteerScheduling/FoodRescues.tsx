import { Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps } from "react-hooks-helper";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import {
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import ShiftCard from "./components/ShiftCard";
// import { VolunteerShiftStepProps } from "./types";

const FoodRescues = ({
  navigation,
  setShiftId,
  setIsFoodRescue
}: {
  navigation: NavigationProps;
  setShiftId: any;
  setIsFoodRescue: any;
}): JSX.Element => {
  const [foodRescues, setFoodRescues] = useState<ScheduleWithShiftType[]>([]);
  // const history = useHistory();

  // React.useEffect(() => {
  //   const getFoodRescues = async () => {
  //     const scheduleResponse = await SchedulingAPIClient.getAllSchedulesThatNeedVolunteers(
  //       false,
  //     );

  //     setFoodRescues(scheduleResponse);

  //   };

  //   getFoodRescues();
  //   console.log(foodRescues);
  // }, []);

  React.useEffect(() => {
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
      {foodRescues.map((scheduleObject: ScheduleWithShiftType, id) => (
        <ShiftCard key={id} shift={scheduleObject} setShiftId={setShiftId} />
      ))}
    </>
  );
};

export default FoodRescues;
