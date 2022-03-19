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

const VolunteerShiftsTabs = (): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  // const [schedules, setSchedules] = useState<Schedule[]>([]);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<number>(0);

  React.useEffect(() => {
    const { hash } = window.location;
    console.log("hash", hash);
    const active = hash === "#checkin" ? 0 : 1;
    console.log("activeness", active);
    setActiveTab(active);
    console.log("active tab", activeTab);
  }, []);

  return (
    <Tabs variant="soft-rounded" colorScheme="gray" defaultIndex={activeTab}>
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
  );
};

export default VolunteerShiftsTabs;
