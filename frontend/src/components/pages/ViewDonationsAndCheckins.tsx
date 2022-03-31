import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import CheckInAPIClient from "../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../APIClients/SchedulingAPIClient";
import menuIcon from "../../assets/menuIcon.svg";
import useViewport from "../../hooks/useViewport";
import { CheckIn } from "../../types/CheckInTypes";
import { Schedule } from "../../types/SchedulingTypes";
import Calendar from "../common/Calendar/Calendar";
import CheckInCalendar from "../common/Calendar/CheckInCalendar";
import FridgeCheckInDescription from "../common/FridgeCheckInDescription";

const ViewDonationsAndCheckins = ({
  isAdminView,
  isCheckInView = false,
}: {
  isAdminView: boolean;
  isCheckInView?: boolean;
}): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());

  const { isMobile } = useViewport();
  const [test, setTest] = useState<any>(0);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => {
    const getSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
    };

    getSchedules();
  }, []);

  useEffect(() => {
    const getCheckIns = async () => {
      const checkInResponse = await CheckInAPIClient.getAllCheckIns();
      setCheckIns(checkInResponse);
    };

    getCheckIns();
  }, [checkIns]);

  const changeDays = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <Container alignContent="left" variant="calendarContainer">
      <Flex
        pt={{ base: "0.5rem", md: "2rem" }}
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <Text
          textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}
          pt="2rem"
        >
          Scheduled donations
        </Text>

        {isCheckInView && (
          <>
            <HStack
              alignItems="center"
              display="flex"
              width="100%"
              alignContent="left"
            >
              <Text textStyle={["mobileHeader2", "desktopHeader2"]}>
                Fridge check-ins
              </Text>

              <Spacer />

              <Show above="md">
                <Stack direction="row" spacing={4}>
                  <Button
                    size="md"
                    onClick={() => {}}
                    variant="create"
                    width="2.5rem"
                    lineHeight="20px"
                  >
                    + Create
                  </Button>

                  <Button
                    size="md"
                    onClick={() => {}}
                    variant="export"
                    leftIcon={<DeleteIcon />}
                    width="2.5rem"
                  >
                    Delete
                  </Button>

                  <Button
                    size="md"
                    onClick={() => {}}
                    variant="export"
                    leftIcon={<DownloadIcon />}
                    width="2.5rem"
                  >
                    Export
                  </Button>
                </Stack>
              </Show>
            </HStack>
            <FridgeCheckInDescription />
            <Show below="md">
              <HStack mt="3.5rem" spacing="7px">
                <Button
                  size="sm"
                  onClick={() => {}}
                  variant="create"
                  width="100%"
                  lineHeight="20px"
                  height="42px"
                  py="12px"
                >
                  + Create
                </Button>
                <Menu placement="bottom-end" size="xs">
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={
                      <Img
                        display="inline"
                        src={menuIcon}
                        alt="menu icon"
                        width="24px"
                      />
                    }
                    variant="export"
                    pl="7px"
                    pr="13px"
                    height="44px"
                  />
                  <MenuList>
                    <MenuItem hover={{ bg: "dorian.100" }}>
                      <Text textStyle="mobileSmall" color="hubbard.100">
                        Export
                      </Text>
                    </MenuItem>
                    <MenuItem _hover={{ bg: "dorian.100" }}>
                      <Text textStyle="mobileSmall" color="hubbard.100">
                        Delete
                      </Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Show>
          </>
        )}
        {isMobile ? (
          <HStack py="1.2rem" width="inherit" alignItems="center">
            <Text textStyle="mobileHeader4" whiteSpace="nowrap">
              {selectedDay?.toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <DatePicker
              value={selectedDay}
              onChange={(e: DateObject) => {
                setSelectedDay(e?.toDate?.());
              }}
              render={<Icon />}
            />
            <IconButton
              backgroundColor="transparent"
              aria-label="previous week"
              onClick={() => {
                changeDays(-1);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              backgroundColor="transparent"
              aria-label="next week"
              onClick={() => {
                changeDays(1);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </HStack>
        ) : (
          <Flex pt="4rem" pb="2.5rem" width="inherit" alignItems="center">
            <HStack alignSelf="center">
              <Text textStyle="desktopHeader" whiteSpace="nowrap">
                {selectedDay?.toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </Text>
              <DatePicker
                value={selectedDay}
                onChange={(e: DateObject) => {
                  setSelectedDay(e?.toDate?.());
                }}
                render={<Icon />}
              />
            </HStack>
            <Spacer />
            <HStack alignSelf="center">
              <IconButton
                backgroundColor="transparent"
                aria-label="previous week"
                onClick={() => {
                  changeDays(-1);
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                backgroundColor="transparent"
                aria-label="next week"
                onClick={() => {
                  changeDays(1);
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </HStack>
          </Flex>
        )}
        {isCheckInView ? (
          <CheckInCalendar
            key={selectedDay?.toString()}
            selectedDay={selectedDay as Date}
            checkIns={checkIns}
          />
        ) : (
          <Calendar
            key={selectedDay?.toString()}
            selectedDay={selectedDay as Date}
            schedules={schedules}
            isAdminView={isAdminView}
          />
        )}
      </Flex>
    </Container>
  );
};

export default ViewDonationsAndCheckins;
