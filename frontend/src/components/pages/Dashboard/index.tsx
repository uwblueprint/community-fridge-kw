import {
  Box,
  Button,
  Container,
  Flex,
  Spinner,
  Stack,
  Text,
<<<<<<< HEAD
  Flex,
=======
>>>>>>> b38d96a (linting)
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

  const date = new Date(); // 2009-11-10
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return (
    <Container variant="dashboardContainer">
      <Stack direction={["column", "row"]} justifyContent="space-between">
        <VStack alignItems="left">
          <Text color="black.100" textStyle="mobileHeader1">
            My Upcoming Donations
          </Text>
          <Text pt="0.8rem" textStyle="mobileBody" color="hubbard.100">
            Thank you for supporting your local community fridge!{" "}
          </Text>
        </VStack>
        <Button
          float="right"
          mt="1.5rem"
          size="lg"
          width={{ lg: "30%", base: "100%" }}
          variant="navigation"
          onClick={() => history.push(Routes.SCHEDULING_PAGE)}
        >
          Schedule new donation
        </Button>
      </Stack>
<<<<<<< HEAD
      <Box
        display={{ lg: "flex" }}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={["60px", "70px"]}
      >
        {schedules.length > 0 ? (
          schedules.map((scheduleObject: Schedule, id) => (
            <DropoffCard key={id} schedule={scheduleObject!} />
          ))
        ) : (
          <Flex paddingTop="1.5rem" >
            <Box 
              display={{ lg: "flex"}} 
              width={{ base: "default", md: "100%" }}
              backgroundColor="squash.100"
              padding={{ base: "0px", md: "3rem" }}
            >
              <Text
                p={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
              >
                You currently have no upcoming donations scheduled! &nbsp;
              </Text>
              <Text
                pl={{ base: "28px", md: "0px" }}
                pr={{ base: "28px", md: "0px" }}
                pb={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
              >
                Schedule a donation today to start giving back. 
              </Text>
            </Box>
          </Flex>
        )}
=======
      <Text mt="4rem" textStyle="mobileHeader2" pb="0px">
        {`${month} ${year}`}
      </Text>
      <Box display={{ lg: "flex" }} flexDirection="row" flexWrap="wrap">
        <Box
          display={{ lg: "flex" }}
          flexDirection="row"
          flexWrap="wrap"
          marginTop={["60px", "70px"]}
        >
          {schedules.length > 0 ? (
            schedules.map((scheduleObject: Schedule, id) => (
              <DropoffCard key={id} schedule={scheduleObject!} />
            ))
          ) : (
            <Box>
              <Box
                display={{ lg: "flex" }}
                flexWrap="wrap"
                backgroundColor="squash.100"
                padding={{ base: "0px", md: "3rem" }}
              >
                <Text
                  p={{ base: "28px", md: "0px" }}
                  color="black.500"
                  textStyle="mobileBody"
                >
                  You currently have no upcoming donations scheduled! &nbsp;
                </Text>
                <Text
                  pl={{ base: "28px", md: "0px" }}
                  pr={{ base: "28px", md: "0px" }}
                  pb={{ base: "28px", md: "0px" }}
                  color="black.500"
                  textStyle="mobileBody"
                >
                  Schedule a donation today to start giving back.
                </Text>
              </Box>
              <Box>{}</Box>
            </Box>
          )}
        </Box>
>>>>>>> d5371af (changed text spacing again)
      </Box>
    </Container>
  );
};

export default Dashboard;
