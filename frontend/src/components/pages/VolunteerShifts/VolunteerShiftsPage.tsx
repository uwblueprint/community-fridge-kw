import { Box, Button, Container, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import { useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Schedule } from "../../../types/SchedulingTypes";
import DropoffCard from "../Dashboard/components/DropoffCard";

const ScheduledVolunteerShiftsPage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const history = useHistory();

  useEffect(() => {
    const getSchedules = async () => {
      const volunteer = await VolunteerAPIClient.getVolunteerByUserId(
        authenticatedUser!.id,
      );

      const scheduleResponse = await SchedulingAPIClient.getScheduleByVolunteerId(
        volunteer.id,
      );

      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, [authenticatedUser]);

  return (
    <Container variant="baseContainer">
      <Stack direction={["column", "row"]} justifyContent="space-between">
        <VStack alignItems="left">
          <Text color="black.100" textStyle="mobileHeader1">
            My volunteer shifts
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
          Volunteer for a shift
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
            <DropoffCard key={id} schedule={scheduleObject!} />
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
                You currently have no upcoming shifts scheduled! &nbsp;
              </Text>
              <Text
                pl={{ base: "28px", md: "0px" }}
                px={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
              >
                Schedule a shift today to start giving back.
              </Text>
            </Box>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default ScheduledVolunteerShiftsPage;
