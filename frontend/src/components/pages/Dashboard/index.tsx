import {
  Box,
  Button,
  Container,
  Flex,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import UPCOMING_WEEK_LIMIT from "../../../constants/DashboardConstants";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "./components/DropoffCard";

const Dashboard = (): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    const getSchedules = async () => {
      const donor = await DonorAPIClient.getDonorByUserId(
        authenticatedUser!.id,
      );

      const scheduleResponse = await SchedulingAPIClient.getScheduleByDonorId(
        donor.id,
        UPCOMING_WEEK_LIMIT,
      );

      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

  if (!schedules || schedules === null) {
    return <Spinner />;
  }

  return (
    <Container variant="baseContainer">
      <Stack direction={["column", "row"]} justifyContent="space-between">
        <VStack alignItems="left">
          <Text color="black.100" textStyle="mobileHeader1">
            My scheduled donations
          </Text>
          <Text
            pt="0.8rem"
            textStyle="mobileBody"
            color="hubbard.100"
            paddingBottom={["8px", "0px"]}
          >
            Thank you for supporting your local community fridge!{" "}
          </Text>
        </VStack>
        <Button
          float="right"
          mt="1.5rem"
          size="md"
          width={{ lg: "25%", base: "100%" }}
          variant="navigation"
          onClick={() => history.push(Routes.SCHEDULING_PAGE)}
        >
          Schedule new donation
        </Button>
      </Stack>
      <Box
        display={{ lg: "flex" }}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={["60px", "70px"]}
      >
        {schedules.length > 0 ? (
          schedules.map((scheduleObject: Schedule, id) => (
            <DropoffCard key={id} schedule={scheduleObject!} isDonorView />
          ))
        ) : (
          <Flex paddingTop="1.5rem" width="100%">
            <Box
              display={{ lg: "flex" }}
              width={{ base: "default", md: "100%" }}
              backgroundColor="squash.100"
              padding={{ base: "0px", md: "3rem" }}
              textAlign="center"
            >
              <Text
                p={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
                ml="auto"
              >
                You currently have no upcoming donations scheduled! &nbsp;
              </Text>
              <Text
                pl={{ base: "28px", md: "0px" }}
                px={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
                pb={{ base: "28px", md: "0px" }}
                mr="auto"
              >
                Schedule a donation today to start giving back.
              </Text>
            </Box>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
