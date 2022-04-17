import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton, Spacer, Text } from "@chakra-ui/react";
import { add } from "date-fns";
import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import useViewport from "../../../hooks/useViewport";

const CalendarToggle = ({
  setSelectedDay,
  selectedDay,
}: {
  selectedDay: Date | DateObject | null;
  setSelectedDay: (date: Date | DateObject | null) => void;
}) => {
  const [currentDate, setCurrentDate] = React.useState(selectedDay);

  const handleDateChange = (days: number) => {
    setSelectedDay(add(currentDate as Date, { days }));
    setCurrentDate(add(currentDate as Date, { days }));
  };
  const { isMobile } = useViewport();

  return isMobile ? (
    <HStack py="1.2rem" width="inherit" alignItems="center">
      <Text textStyle="mobileHeader4" whiteSpace="nowrap">
        {currentDate?.toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <DatePicker
        value={currentDate}
        onChange={(e: DateObject) => {
          setSelectedDay(e?.toDate?.());
        }}
        render={<Icon />}
      />
      <IconButton
        backgroundColor="transparent"
        aria-label="previous day"
        onClick={() => handleDateChange(-1)}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        backgroundColor="transparent"
        aria-label="next day"
        onClick={() => handleDateChange(+1)}
      >
        <ChevronRightIcon />
      </IconButton>
    </HStack>
  ) : (
    <Flex pb="2.5rem" width="inherit" alignItems="center">
      <HStack alignSelf="center">
        <DatePicker
          value={currentDate}
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
          aria-label="previous day"
          onClick={() => handleDateChange(-1)}
        >
          <ChevronLeftIcon w={8} h={8} />
        </IconButton>
        <IconButton
          backgroundColor="transparent"
          aria-label="next day"
          onClick={() => handleDateChange(+1)}
        >
          <ChevronRightIcon w={8} h={8} />
        </IconButton>
      </HStack>
    </Flex>
  );
};

export default CalendarToggle;
