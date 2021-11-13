import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Box, Button, IconButton, Stack, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon"

import AdminCalendar from "./AdminCalendar";

const ViewDonations = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());
  const [test, setTest] = useState<any>(0);

  const changeWeek = (days: number) => {
    setTest(test + 1);

    const newDate: Date = selectedDay as Date;
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDay(newDate);
  };

  return (
    <>
      <div>
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
            changeWeek(-7);
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          backgroundColor="transparent"
          aria-label="next week"
          onClick={() => {
            changeWeek(7);
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>

      <AdminCalendar
        key={selectedDay?.toString()}
        selectedDay={selectedDay as Date}
      />
    </>
  );
};

export default ViewDonations;
