import { Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { Schedule } from "../../../types/SchedulingTypes";
import FoodRescueCard from "./components/FoodRescueCard";
import { VolunteerShiftStepProps } from "./types";

const FoodRescues = ({ navigation }: VolunteerShiftStepProps): JSX.Element => {
  const [foodRescues, setFoodRescues] = useState<Schedule[]>([]);
  // const history = useHistory();

  React.useEffect(() => {
    const getFoodRescues = async () => {
      const scheduleResponse = await SchedulingAPIClient.getAllSchedulesThatNeedVolunteers(
        false,
      );
      setFoodRescues(scheduleResponse);
    };

    getFoodRescues();
    console.log(foodRescues);
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
      {foodRescues.map((scheduleObject: Schedule, id) => (
        <FoodRescueCard
          key={id}
          schedule={scheduleObject}
          navigation={navigation}
        />
      ))}
    </>
  );
};

export default FoodRescues;
