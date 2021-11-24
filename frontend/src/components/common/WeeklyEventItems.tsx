import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { colorMap } from "../../constants/DaysInWeek";

type DefaultWeeklyEventItemProps = {
  title: string;
  date: string;
  frequency: string;
};

const DefaultWeeklyEventItem = ({
  title,
  date,
  frequency,
}: DefaultWeeklyEventItemProps) => {
  return (
    <Container
      color="#FAFCFE"
      borderWidth="1px"
      borderRadius="8px"
      borderColor="#D8DDE0"
      alignItems="center"
      centerContent
      py="24px"
      px="30px"
    >
      <Text textAlign="center" textStyle="desktopBodyBold" mb="8px">
        {title}
      </Text>
      <Text textAlign="center" textStyle="desktopSmall" mb="16px">
        {date}
      </Text>
      <Badge
        color={`${(colorMap as any)[frequency]}.100`}
        backgroundColor={`${(colorMap as any)[frequency]}.200`}
        textStyle="desktopSmall"
        py="6px"
        ph="14px"
      >
        {" "}
        {frequency}{" "}
      </Badge>
    </Container>
  );
};

export default DefaultWeeklyEventItem;
