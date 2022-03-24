import { AddIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
    Container,
    Flex,
    HStack,
    IconButton,
    Spacer,
    Text,
    Link,
    Button,
    Img,
    useDisclosure,
    Box,
    Stack
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

import SchedulingAPIClient from "../../APIClients/SchedulingAPIClient";
import useViewport from "../../hooks/useViewport";
import Calendar from "../common/Calendar/Calendar";
import pencilIconHollow from "../../assets/pencilIconHollow.svg";
import downloadIcon from "../../assets/downloadIcon.svg";
import deleteIcon from "../../assets/deleteIcon.svg";
import { CheckIn } from "../../types/CheckInTypes";
import CheckInAPIClient from "../../APIClients/CheckInAPIClient";
import CheckInCalendar from "../common/Calendar/CheckInCalendar";

const ViewCheckIns = ({
    isAdminView,
}: {
    isAdminView: boolean;
}): React.ReactElement => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSavingData, setIsSavingData] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

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
    }, []);

    const changeDays = (days: number) => {
        setTest(test + 1); // need this for some reason

        const newDate: Date = selectedDay as Date;
        newDate?.setDate(newDate?.getDate() + days);
        setSelectedDay(newDate);
    };

    const changeEditMode = () => {
        setIsSavingData(false);
        setIsEditing(!isEditing);
    };

    const EditDescriptionButton = () => {
        return !isEditing ? (
            <Button
                variant="editInfo"
                rightIcon={
                    <Img
                        src={pencilIconHollow}
                        alt="pencil icon"
                        width="24px"
                        display="inline"
                    />
                }
                onClick={changeEditMode}
            />
        ) : (
            <IconButton
                variant="cancelEditInfo"
                aria-label="Cancel editing"
                icon={<CloseIcon />}
                onClick={onOpen}
            />
        );
    };

    return (
        <Container alignContent="left" variant="calendarContainer">
            <Flex
                pt={{ base: "0.5rem", md: "2rem" }}
                flexDirection="column"
                justifyContent="space-between"
                display={{ base: "inline", md: "flex" }}
            >
                <Box flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    display={isMobile ? "" : "flex"}
                    alignContent="left">
                    <Text
                        textStyle={isMobile ? "mobileHeader2" : "desktopHeader2"}
                        pt="2rem"
                    >
                        Fridge check-ins
                    </Text>
                    <Spacer />
                    {!isMobile ? (
                        <Stack direction='row' spacing={4}>
                            <Button
                                size="md"
                                onClick={() => { }}
                                variant="create"
                                width="2.5rem"
                                lineHeight="20px"
                            >
                                +  Create
                            </Button>

                            <Button
                                size="md"
                                onClick={() => { }}
                                variant="export"
                                leftIcon={<Img
                                    src={deleteIcon}
                                    alt="delete icon"
                                    width="16px"
                                    display="inline"
                                />}
                                width="2.5rem"
                            >
                                Delete
                            </Button>

                            <Button
                                size="md"
                                onClick={() => { }}
                                variant="export"
                                leftIcon={<Img
                                    src={downloadIcon}
                                    alt="download icon"
                                    width="16px"
                                    display="inline"
                                />}
                                width="2.5rem"
                            >
                                Export
                            </Button>
                        </Stack>)
                        : (<></>)}
                </Box>

                <Text
                    textStyle={isMobile ? "mobileHeader4" : "desktopSubtitle"}
                    pt="2rem"
                >
                    Fridge check-in description
                    <EditDescriptionButton />
                </Text>
                <Text
                    textStyle={isMobile ? "mobileBody" : "desktopBody"}
                    pt="2rem"
                >
                    Select a card to see more details pertaining to the upcoming donation. Select a card to see more details pertaining to the upcoming donation. Select select a card to see more details pertaining to the Select a card  upcoming donation. Select a card to see more details pertaining to the upcoming donation. Select a card to see more details pertaining to the upcoming donation. Select a card Select a card to see more details pertaining to the upcoming donation. Select a card to see more details pertaining to the upcoming donation.

                    <br />
                    <br />
                    <Link color="#498FB6" textDecoration="underline" textStyle={isMobile ? "mobileLink" : "desktopLink"} href="www.google.com" isExternal>
                        Link to instructions
                    </Link>
                </Text>

                {isMobile ?
                    (<Button
                        mt="3.5rem"
                        size="md"
                        onClick={() => { }}
                        variant="create"
                        width="100%"
                        lineHeight="20px"
                    >
                        +  Create
                    </Button>) : (<></>)
                }

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
