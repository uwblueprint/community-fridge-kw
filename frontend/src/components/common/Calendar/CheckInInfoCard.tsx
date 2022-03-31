import {
  Box,
  Button,
  Flex,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import menuIcon from "../../../assets/menuIcon.svg";
import useViewport from "../../../hooks/useViewport";
import { CheckIn } from "../../../types/CheckInTypes";
import { VolunteerResponse } from "../../../types/VolunteerTypes";
import CardSubInformation from "../Card";

const CheckInInfoCard = ({ checkIn }: { checkIn: CheckIn }): JSX.Element => {
  const [volunteer, setVolunteer] = useState<VolunteerResponse>(
    {} as VolunteerResponse,
  );
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckIn>(checkIn);

  const startTimeLocal = format(new Date(currentCheckIn.startDate), "hh:mmaa");
  const endTimeLocal = format(new Date(currentCheckIn.endDate), "hh:mmaa");
  const { isMobile } = useViewport();

  useEffect(() => {
    const getVolunteerData = async () => {
      if (currentCheckIn.volunteerId !== null) {
        const volunteerResponse = await VolunteerAPIClient.getVolunteerById(
          currentCheckIn.volunteerId ? String(currentCheckIn.volunteerId) : "",
        );
        setVolunteer(volunteerResponse);
      } else {
        setVolunteer({} as VolunteerResponse);
      }
    };
    getVolunteerData();
  }, [currentCheckIn.volunteerId]);

  const removeVolunteer = async () => {
    const checkInResponse = await CheckInAPIClient.updateCheckInById(
      currentCheckIn.id,
      {
        volunteerId: undefined,
        isAdmin: false,
      },
    );
    setCurrentCheckIn(checkInResponse);
  };

  const volunteerAsAdmin = async () => {
    const checkInResponse = await CheckInAPIClient.updateCheckInById(
      currentCheckIn.id,
      {
        isAdmin: true,
      },
    );
    setCurrentCheckIn(checkInResponse);
  };

  const deleteCheckIn = async () => {
    await CheckInAPIClient.deleteCheckInById(currentCheckIn.id);
  };

  const RemoveVolunteerButton = () => (
    <Button
      variant="changePassword"
      fontSize="14px"
      lineHeight="20px"
      fontWeight="700"
      py="10px"
      px="20px"
      onClick={removeVolunteer}
      width={["100%", "164px"]}
    >
      Remove Volunteer
    </Button>
  );

  const VolunteerAsAdminButton = () => (
    <Button
      variant="navigation"
      fontSize="14px"
      lineHeight="20px"
      fontWeight="700"
      py="12px"
      px="16px"
      onClick={volunteerAsAdmin}
      width={["100%", "164px"]}
    >
      Volunteer as admin
    </Button>
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
    <Box
      px={["32px", "36px"]}
      py={["28px", "32px"]}
      border="1px solid"
      borderColor="dorian.100"
      width="100%"
      overflow="hidden"
      display="box"
    >
      <Stack
        direction="column"
        display={["default", "flex"]}
        spacing={["30px", "21px"]}
        alignItems="left"
      >
        <Flex direction="row" alignItems="center" display="flex">
          <Box>
            <Text
              textStyle="mobileHeader4"
              whiteSpace="nowrap"
              minWidth="225px"
            >
              {`${startTimeLocal}-${endTimeLocal}`}
            </Text>
          </Box>
          <Spacer />
          <Box>
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
                variant="plain"
              />
              <MenuList style={menuListStyle}>
                <MenuItem style={menuItemStyle}>
                  <Text textStyle="mobileSmall" color="hubbard.100">
                    Edit
                  </Text>
                </MenuItem>
                <MenuItem style={menuItemStyle} onClick={deleteCheckIn}>
                  <Text textStyle="mobileSmall" color="hubbard.100">
                    Delete
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
        <Stack
          align="left"
          direction={["column", "row"]}
          spacing={["25px", "40px"]}
          pb={["0px", "27px"]}
        >
          <VStack align="left">
            <Text textStyle="mobileBody" lineHeight="22px" color="hubbard.100">
              VOLUNTEER ASSIGNED
            </Text>
            {Object.keys(volunteer).length === 0 && !currentCheckIn.isAdmin ? (
              <Text textStyle="mobileBodyBold">None</Text>
            ) : (
              <Text
                textStyle="mobileBody"
                as={currentCheckIn.isAdmin ? "i" : undefined}
                lineHeight="22px"
              >
                {currentCheckIn.isAdmin
                  ? "Admin"
                  : `${volunteer.firstName} ${volunteer.lastName}`}
              </Text>
            )}
          </VStack>
          <CardSubInformation
            description="Phone Number"
            value={
              Object.keys(volunteer).length === 0 || !volunteer.phoneNumber
                ? "-"
                : `${volunteer.phoneNumber}`
            }
          />
          <CardSubInformation
            description="Email Address"
            value={
              Object.keys(volunteer).length === 0 || !volunteer.email
                ? "-"
                : `${volunteer.email}`
            }
          />
          {isMobile && (
            <CardSubInformation
              description="Notes"
              value={currentCheckIn.notes ?? ""}
            />
          )}
        </Stack>
        {!isMobile && (
          <Text textStyle="desktopSmall">{currentCheckIn.notes}</Text>
        )}
        <Box align="right">
          {Object.keys(volunteer).length === 0 && !currentCheckIn.isAdmin ? (
            <VolunteerAsAdminButton />
          ) : (
            <RemoveVolunteerButton />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default CheckInInfoCard;
