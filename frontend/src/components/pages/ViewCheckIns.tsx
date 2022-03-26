import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Img,
  Link,
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
import menuIcon from "../../assets/menuIcon.svg";
import useViewport from "../../hooks/useViewport";
import { CheckIn } from "../../types/CheckInTypes";
import CheckInCalendar from "../common/Calendar/CheckInCalendar";

const ViewCheckIns = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<
    Date | DateObject | DateObject[] | null
  >(new Date());

  const { isMobile } = useViewport();
  const [test, setTest] = useState<any>(0);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

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

  const EditDescriptionButton = () => (
    <Button
      variant="editInfo"
      rightIcon={<EditIcon size={24} />}
      onClick={() => alert("Edit content clicked!")}
    />
  );

  const menuListStyle = {
    minWidth: "105px",
    minHeight: "80px",
    borderColor: "dorian.100",
    shadow: "none",
  };

  const menuItemStyle = {
    borderRadius: "0.4rem",
    margin: "auto",
    width: "95%",
  };

  return (
    <Container
      alignContent="left"
      variant="calendarContainer"
      pt={["84px", "108px"]}
      px={["12px", "0"]}
    >
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        display={{ base: "inline", md: "flex" }}
      >
        <HStack
          alignItems="center"
          display="flex"
          width="100%"
          alignContent="left"
        >
          <Text textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}>
            Fridge check-ins
          </Text>

          <Spacer />

          <Show above="sm">
            {!isMobile ? (
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
            ) : (
              <></>
            )}
          </Show>
        </HStack>

        <Text
          textStyle={isMobile ? "mobileHeader4" : "desktopSubtitle"}
          pt="2rem"
        >
          Fridge check-in description
          <EditDescriptionButton />
        </Text>
        <Text textStyle={isMobile ? "mobileBody" : "desktopBody"} pt="2rem">
          Select a card to see more details pertaining to the upcoming donation.
          Select a card to see more details pertaining to the upcoming donation.
          Select select a card to see more details pertaining to the Select a
          card upcoming donation. Select a card to see more details pertaining
          to the upcoming donation. Select a card to see more details pertaining
          to the upcoming donation. Select a card Select a card to see more
          details pertaining to the upcoming donation. Select a card to see more
          details pertaining to the upcoming donation.
          <br />
          <br />
          <Link
            color="#498FB6"
            textDecoration="underline"
            textStyle={isMobile ? "mobileLink" : "desktopLink"}
            href="www.google.com"
            isExternal
          >
            Link to instructions
          </Link>
        </Text>

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
              <MenuList style={menuListStyle}>
                <MenuItem style={menuItemStyle} _hover={{ bg: "dorian.100" }}>
                  <Text textStyle="mobileSmall" color="hubbard.100">
                    Export
                  </Text>
                </MenuItem>
                <MenuItem style={menuItemStyle} _hover={{ bg: "dorian.100" }}>
                  <Text textStyle="mobileSmall" color="hubbard.100">
                    Delete
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Show>

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
        <CheckInCalendar
          key={selectedDay?.toString()}
          selectedDay={selectedDay as Date}
          checkIns={checkIns}
        />
      </Flex>
    </Container>
  );
};

export default ViewCheckIns;
