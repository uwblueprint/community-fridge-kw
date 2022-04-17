import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DateObject } from "react-multi-date-picker";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import useViewport from "../../../hooks/useViewport";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import { downloadCSV } from "../../../utils/CSVUtils";
import Calendar from "../../common/Calendar/Calendar";
import CalendarToggle from "../../common/Calendar/CalendarToggle";
import FridgeCheckInDescription from "../../common/FridgeCheckInDescription";
import FridgeFoodRescueDescription from "../../common/FridgeFoodRescueDescription";
import CheckInAdminButtons from "./components/CheckInAdminButtons";
import { getScheduleCSVData } from "./getCSVData";

const ViewDonationsAndCheckIns = ({
  isAdminView,
  isCheckInView = false,
}: {
  isAdminView: boolean;
  isCheckInView?: boolean;
}): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<Date | DateObject | null>(
    new Date(),
  );
  const toast = useToast();

  const { isMobile } = useViewport();
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
    if (isCheckInView) {
      getCheckIns();
    } else {
      getSchedules();
    }
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

  // Selects a filter
  const handleSelectFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value.toString());
  };

  const deleteCheckIn = (checkInId: string) => {
    const res = CheckInAPIClient.deleteCheckInById(checkInId);
    if (!res) {
      toast({
        title: "There was an error deleting this check-in",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Check-ins have been successfully deleted",
      status: "success",
      duration: 7000,
      isClosable: true,
    });
    setCheckIns([
      ...checkIns.filter((checkIn: CheckIn) => checkIn.id !== checkInId),
    ]);
  };

  const handleCSVDownload = async () => {
    const csvScheduleData = await getScheduleCSVData();
    downloadCSV(csvScheduleData, "foodRescues");
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
              onClick={handleCSVDownload}
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

      <CalendarToggle
        selectedDay={selectedDay}
        setSelectedDay={(day) => setSelectedDay(day)}
      />
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
