import {
  Box,
  Button,
  Container,
  Flex,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import FoodRescueCard from "./components/FoodRescueCard";
import { ShiftStepProps } from "./types";

const FoodRescues = ({
  setIsRescue,
  navigation,
  setShiftId,
}: ShiftStepProps): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  // const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [foodRescues, setFoodRescues] = useState<Schedule[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    const getFoodRescues = async () => {
      const foodRescueResponse = await SchedulingAPIClient.getAllSchedulesByPickupOrUnload(
        true,
      );
      setFoodRescues(foodRescueResponse);
    };
    setIsRescue(true);
    getFoodRescues();
  }, []);

  if (!foodRescues || foodRescues === null) {
    return <Spinner />;
  }

  return (
    <div>
      <Text pt="0.8rem" textStyle="mobileHeader4" color="black.100">
        Food rescue shifts{" "}
      </Text>
      <Text pt="0.8rem" textStyle="mobileBody" color="hubbard.100">
        Food rescue shifts are picking up food from donors and helping bring
        them to the fridge.{" "}
      </Text>
      <Box
        display={{ lg: "flex" }}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={["60px", "70px"]}
      >
        {foodRescues.length > 0 ? (
          foodRescues.map((scheduleObject: Schedule, id) => (
            <FoodRescueCard
              key={id}
              schedule={scheduleObject}
              navigation={navigation}
              setShiftId={setShiftId}
            />
          ))
        ) : (
          <Flex paddingTop="1.5rem">
            <Box
              display={{ lg: "flex" }}
              width={{ base: "default", md: "100%" }}
              backgroundColor="squash.100"
              padding={{ base: "0px", md: "3rem" }}
            >
              <Text
                p={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
              >
                There are currently no food rescues available for signup! &nbsp;
              </Text>
              {/* <Text
                    pl={{ base: "28px", md: "0px" }}
                    px={{ base: "28px", md: "0px" }}
                    color="black.500"
                    textStyle="mobileBody"
                  >
                    Schedule a donation today to start giving back.
                  </Text> */}
            </Box>
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default FoodRescues;
