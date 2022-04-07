import {
  Container,
  Stack,
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

import CheckIns from "./CheckIns";
import FoodRescues from "./FoodRescues";
// import { VolunteerShiftStepProps } from "./types";

const VolunteerShiftsTabs = ({
  navigation,
  setShiftId,
  setIsFoodRescue,
}: {
  navigation: NavigationProps;
  setShiftId: any;
  setIsFoodRescue: any;
}): JSX.Element => {
  return (
    <Container variant="baseContainer">
      <Stack direction={["column", "row"]} justifyContent="space-between">
        <VStack alignItems="left">
          <Text color="black.100" textStyle="mobileHeader1">
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
                  setShiftId={setShiftId}
                  setIsFoodRescue={setIsFoodRescue}
                />
              </TabPanel>
              <TabPanel id="rescue">
                <FoodRescues
                  navigation={navigation}
                  setShiftId={setShiftId}
                  setIsFoodRescue={setIsFoodRescue}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Stack>
    </Container>
  );
};

export default VolunteerShiftsTabs;
