import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Select,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import useViewport from "../../../hooks/useViewport";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import Calendar from "../../common/Calendar/Calendar";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import FridgeFoodRescueDescription from "../../common/FridgeFoodRescueDescription";
import CheckInAdminButtons from "./components/CheckInAdminButtons";

const ViewDonationsAndCheckIns = ({
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
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  enum DonationFilterType {
    ALL = "all",
    UNASSIGNED = "unassigned",
    FILLED = "filled",
  }

  const donationTypefilterOptions = [
    {
      value: DonationFilterType.ALL,
      label: "All donations",
    },
    {
      value: DonationFilterType.UNASSIGNED,
      label: "Unassigned",
    },
    {
      value: DonationFilterType.FILLED,
      label: "Filled",
    },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    DonationFilterType.ALL,
  );

  useEffect(() => {
    const getSchedules = async () => {
      const scheduleResponse = await SchedulingAPIClient.getSchedules();
      setSchedules(scheduleResponse);
      setFilteredSchedules(scheduleResponse);
    };

    const getCheckIns = async () => {
      const checkInResponse = await CheckInAPIClient.getAllCheckIns();
      setCheckIns(checkInResponse);
    };

    getSchedules();
    getCheckIns();
  }, []);

  // filter donations/schedules based on selected filter
  React.useMemo(() => {
    if (selectedFilter === DonationFilterType.FILLED) {
      setFilteredSchedules([
        ...schedules.filter(
          (schedule) =>
            schedule.volunteerId != null && schedule.volunteerNeeded,
        ),
      ]);
    } else if (selectedFilter === DonationFilterType.UNASSIGNED) {
      setFilteredSchedules([
        ...schedules.filter(
          (schedule) =>
            schedule.volunteerId == null && schedule.volunteerNeeded,
        ),
      ]);
    } else {
      setFilteredSchedules([...schedules]);
    }
  }, [selectedFilter]);

  const changeDays = (days: number) => {
    setTest(test + 1); // need this for some reason

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  // Selects a filter
  const handleSelectFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value.toString());
  };

  const deleteCheckIn = (checkInId: string) => {
    CheckInAPIClient.deleteCheckInById(checkInId);
    setCheckIns([
      ...checkIns.filter((checkIn: CheckIn) => checkIn.id !== checkInId),
    ]);
  };

  return (
    <Container alignContent="left" variant="calendarContainer">
      <Stack
        direction={isMobile ? "column" : "row"}
        width="100%"
        justifyContent="space-between"
      >
        <Text
          textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}
          pt="2rem"
          pb="30px"
        >
          {isCheckInView ? "Fridge check-ins" : "Scheduled donations"}
        </Text>
        {isAdminView && (
          <HStack spacing="15px" justifyContent="flex-end">
            <Button
              variant={isMobile ? "exportMobile" : "export"}
              leftIcon={<DownloadIcon />}
              flex={1}
            >
              Export
            </Button>
            <Select
              color="hubbard.100"
              background={["dorian.100", "none"]}
              border={["none", "1px"]}
              borderColor={["none", "dorian.100"]}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleSelectFilter(e);
              }}
              flex={[1.5, 2.5]}
            >
              {donationTypefilterOptions.map((option, key) => {
                return (
                  <option key={key} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </HStack>
        )}
        {isCheckInView && <CheckInAdminButtons />}
      </Stack>
      {isAdminView && <FridgeFoodRescueDescription />}
      {isCheckInView && <FridgeCheckInDescription />}

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
      <Calendar
        key={selectedDay?.toString()}
        selectedDay={selectedDay as Date}
        items={isCheckInView ? checkIns : filteredSchedules}
        isAdminView={isAdminView}
        isCheckInView={isCheckInView}
        deleteCheckIn={deleteCheckIn}
      />
    </Container>
  );
};

export default ViewDonationsAndCheckIns;
