import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps } from "react-hooks-helper";
import { NavLink } from "react-router-dom";

import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
} from "../../../types/VolunteerTypes";
import CheckIns from "./CheckIns";
import FoodRescues from "./FoodRescues";

const VolunteerShiftsTabs = ({
  navigation,
  setSelectedVolunteerShift,
}: {
  navigation: NavigationProps;
  setSelectedVolunteerShift: (
    shift: ScheduleWithShiftType | CheckInWithShiftType,
  ) => void;
}): JSX.Element => {
  return (
    <Container variant="baseContainer">
      <VStack alignItems="left">
        <Text color="black.100" textStyle="mobileHeader1" pb="1rem">
          Volunteer Shifts
        </Text>
        <Tabs
          defaultIndex={window.location.hash === "#rescue" ? 1 : 0}
          variant="soft-rounded"
          colorScheme="dorian"
        >
          <TabList>
            <NavLink to={{ hash: "checkin" }}>
              <Tab>Fridge check-in</Tab>{" "}
            </NavLink>
            <NavLink to={{ hash: "rescue" }}>
              <Tab>Food rescue</Tab>{" "}
            </NavLink>
          </TabList>
          <TabPanels>
            <TabPanel id="checkin">
              <CheckIns
                navigation={navigation}
                setSelectedVolunteerShift={setSelectedVolunteerShift}
              />
            </TabPanel>
            <TabPanel id="rescue">
              <FoodRescues
                navigation={navigation}
                setSelectedVolunteerShift={setSelectedVolunteerShift}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default VolunteerShiftsTabs;
