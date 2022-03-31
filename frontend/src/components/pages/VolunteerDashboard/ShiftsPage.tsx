import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import VolunteerShiftCard from "./ShiftCard";
import { CheckInWithShiftType, ScheduleWithShiftType } from "../../../types/VolunteerTypes";

const ScheduledVolunteerShiftsPage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const [shifts, setShifts] = useState<(CheckInWithShiftType | ScheduleWithShiftType)[]>([]);
  const history = useHistory();

  useEffect(() => {
    const getShifts = async () => {
      const volunteer = await VolunteerAPIClient.getVolunteerByUserId(
        authenticatedUser!.id,
      );

      const shiftsResponse = await VolunteerAPIClient.getCheckInsAndSchedules(
        volunteer.id,
      );

      setShifts(shiftsResponse);
    };

    getShifts();
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
          size="lg"
          width={{ lg: "40%", base: "100%" }}
          variant="navigation"
          onClick={() => history.push(Routes.SCHEDULING_PAGE)}
        >
          Volunteer for a shift
        </Button>
      </Stack>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        marginTop={["60px", "70px"]}
      >
        {!!shifts.length &&
          shifts.map((shiftObject: (CheckInWithShiftType | ScheduleWithShiftType), id) => (
            <VolunteerShiftCard key={id} shift={shiftObject!} />
          ))}
        {!shifts.length && (
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
      </VStack>
    </Container>
  );
};

export default ScheduledVolunteerShiftsPage;
