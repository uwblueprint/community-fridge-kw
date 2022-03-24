import { AddIcon, EditIcon, ExternalLinkIcon, HamburgerIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, Stack, Text, VStack, Button, Menu, MenuButton, IconButton, MenuList, MenuItem, Spacer, Flex, Img } from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import { getFrequencyColor } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import { CheckIn } from "../../../types/CheckInTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import { VolunteerResponse } from "../../../types/VolunteerTypes";
import { DonationFrequency } from "../../pages/Scheduling/types";
import { FridgeIcon, PersonIcon } from "../icons";
import { AuthenticatedUser } from "../../../types/AuthTypes";
import { getLocalStorageObj } from "../../../utils/LocalStorageUtils";
import {
    AUTHENTICATED_USER_KEY,
} from "../../../constants/AuthConstants";
import useViewport from "../../../hooks/useViewport";
import menuIcon from "../../../assets/menuIcon.svg"

const CheckInInfoCard = ({
    checkIn,
}: {
    checkIn: CheckIn;
}): JSX.Element => {
    const {
        id,
        volunteerId,
        startDate,
        endDate,
        notes,
        isAdmin
    } = checkIn;

    const startTimeLocal = format(new Date(startDate), "h:mm aa");
    const endTimeLocal = format(new Date(endDate), "h:mm aa");
    const { isMobile } = useViewport();

    const [volunteer, setVolunteer] = useState<VolunteerResponse>(
        {} as VolunteerResponse,
    );

    useEffect(() => {
        const getVolunteerData = async () => {
            // TODO: fix???
            if (volunteerId?.toString() !== "null") {
                const volunteerResponse = await VolunteerAPIClient.getVolunteerById((volunteerId ?? "").toString());
                setVolunteer(volunteerResponse);
            }
            else {
                setVolunteer({} as VolunteerResponse);
            }
        };
        getVolunteerData();

    }, [checkIn.volunteerId]);


    const currentUser: AuthenticatedUser | undefined = getLocalStorageObj<AuthenticatedUser>(
        AUTHENTICATED_USER_KEY,
    );

    const removeVolunteer = async () => {
        await CheckInAPIClient.updateCheckInById(id, { ...checkIn, volunteerId: undefined });
    }

    const volunteerAsAdmin = async () => {
        await CheckInAPIClient.updateCheckInById(id, { ...checkIn, isAdmin: true, volunteerId: Number(currentUser?.id) });
    }

    const RemoveVolunteerButton = () => (
        <Button variant="changePassword" fontSize="14px"
            lineHeight="20px"
            fontWeight="700"
            py="10px"
            px="20px"
            onClick={removeVolunteer}
            width={isMobile ? "100%" : ""}
        >
            Remove Volunteer
        </Button>
    );

    const VolunteerAsAdminButton = () => (
        <Button variant="navigation" fontSize="14px"
            lineHeight="20px"
            fontWeight="700"
            py="10px"
            px="15.5px"
            width={isMobile ? "100%" : ""}
        >
            Volunteer as admin
        </Button>
    );

    return (
        <Box
            px={isMobile ? "32px" : "36px"}
            py={isMobile ? "28px" : "32px"}
            border="1px solid"
            borderColor="dorian.100"
            width="100%"
            overflow="hidden"
        >
            <Stack
                direction={isMobile ? "row" : "column"}
                p="6"
                display={["default", "flex"]}
                spacing={["0", "4"]}
                alignItems="left"
            >
                <Flex direction="row" alignItems="top" display="flex">
                    <Box >
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
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<Img
                                    display="inline" src={menuIcon} alt="menu icon" width="24px" />}
                                variant='plain'
                            />
                            {/* TODO: style menu */}
                            <MenuList alignContent="left">
                                <MenuItem>
                                    <Text textStyle="mobileSmall" color="hubbard.100">Edit</Text>
                                </MenuItem>
                                <MenuItem>
                                <Text textStyle="mobileSmall" color="hubbard.100">Delete</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
                <Stack align="left" direction={isMobile ? "column" : "row"} spacing={isMobile ? "25px" : "40px"} pb="29px">
                    <VStack align="left">
                        <Text textStyle="mobileBody" lineHeight="22px" color="hubbard.100">
                            VOLUNTEER ASSIGNED
                        </Text>
                        {volunteerId?.toString() === "null" ? (
                            <Text textStyle="mobileBodyBold">
                                None
                            </Text>
                        ) : (
                            <Text textStyle="mobileBody" lineHeight="22px">
                                {isAdmin ? "Admin" : `${volunteer.firstName} ${volunteer.lastName}`}
                            </Text>
                        )}
                    </VStack>
                    <VStack align="left">
                        <Text textStyle="mobileBody" lineHeight="22px" color="hubbard.100">
                            PHONE NUMBER
                        </Text>
                        <Text textStyle="mobileBody" lineHeight="22px">
                            {(volunteerId?.toString() === "null" || !volunteer.phoneNumber) ?
                                "-"
                                :
                                `${volunteer.phoneNumber}`
                            }
                        </Text>
                    </VStack>
                    <VStack align="left">
                        <Text textStyle="mobileBody" lineHeight="22px" color="hubbard.100">
                            EMAIL
                        </Text>
                        <Text textStyle="mobileBody" lineHeight="22px">
                            {(volunteerId?.toString() === "null" || !volunteer.email) ?
                                "-"
                                :
                                `${volunteer.email}`
                            }
                        </Text>
                    </VStack>
                    {isMobile && notes ? (
                        <VStack align="left">
                            <Text textStyle="mobileBody" lineHeight="22px" color="hubbard.100">
                                NOTES
                            </Text>
                            <Text textStyle="mobileBody" lineHeight="22px">{notes}</Text>
                        </VStack>
                    ) : (<></>)}
                </Stack>
                {notes && !isMobile ?
                    (<Text>
                        {notes}
                    </Text>) :
                    <></>
                }
                <Box align={isMobile ? "" : "right"} pt={isMobile ? "15px" : "27px"}>
                    {(volunteerId?.toString() === "null") ?
                        <VolunteerAsAdminButton /> : <RemoveVolunteerButton />
                    }
                </Box>
            </Stack>

        </Box >
    );
};

export default CheckInInfoCard;
