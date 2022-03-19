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
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import CheckInCard from "./CheckInCard";
import VolunteerShiftsTabs from "./VolunteerShiftTabs";

const VolunteerShifts = (): JSX.Element => {
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
          <VolunteerShiftsTabs />
        </VStack>
      </Stack>
    </Container>
  );
};

export default VolunteerShifts;
