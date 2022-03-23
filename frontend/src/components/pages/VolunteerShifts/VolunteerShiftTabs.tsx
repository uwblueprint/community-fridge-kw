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
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
  Switch,
  useHistory,
  useParams,
} from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import CheckIns from "./CheckIns";
import FoodRescues from "./FoodRescues";
import { ShiftStepProps } from "./types";

const VolunteerShiftsTabs = ({
  setIsRescue,
  navigation,
  setShiftId
}: ShiftStepProps): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  // const [schedules, setSchedules] = useState<Schedule[]>([]);
  const history = useHistory();

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
                <FoodRescues
                  navigation={navigation}
                  setIsRescue={setIsRescue}
                  setShiftId={setShiftId}
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
