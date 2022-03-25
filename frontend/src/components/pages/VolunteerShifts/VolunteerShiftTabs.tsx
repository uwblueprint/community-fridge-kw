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
import { NavLink } from "react-router-dom";

import CheckIns from "./CheckIns";
import FoodRescues from "./FoodRescues";

const VolunteerShiftsTabs = (): JSX.Element => {
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
            colorScheme="gray"
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
                <CheckIns />
              </TabPanel>
              <TabPanel id="rescue">
                <FoodRescues />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Stack>
    </Container>
  );
};

export default VolunteerShiftsTabs;
