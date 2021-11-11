import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import React from "react";

type DefaultWeeklyEventItemProps = {
  title: string;
  date: string;
};

const DefaultWeeklyEventItem = ({
  title,
  date,
}: DefaultWeeklyEventItemProps) => {
  return (
    <Box
      color="#FAFCFE"
      borderWidth="1px"
      borderRadius="lg"
      borderColor="#C4DAD6"
      alignItems="center"
      p={5}
    >
      <Text textAlign="center" textStyle="calendarEventHeader">{title}</Text>
      <Text textAlign="center" textStyle="calendarEventTime">{date}</Text>
    </Box>
  );
};

export default DefaultWeeklyEventItem;
