import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { colorMap } from "../../../constants/DaysInWeek";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import { CheckIn } from "../../../types/CheckInTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import { Schedule } from "../../../types/SchedulingTypes";
import ErrorSchedulingModal from "../../common/GeneralErrorModal";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import DeleteScheduleModal from "../Dashboard/components/DeleteScheduleModal";
import ModifyRecurringModal from "../Dashboard/components/ModifyRecurringDonationModal";
import BackButton from "../Scheduling/BackButton";
import {
  DonationFrequency,
  DonationSizes,
  SchedulingStepProps,
} from "../Scheduling/types";
import { ShiftStepProps } from "./types";

const ConfirmShift = ({ isRescue, navigation }: ShiftStepProps) => {
  const { previous, next, go } = navigation;
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);

  const [currentDonor, setCurrentDonor] = useState<DonorResponse>(
    {} as DonorResponse,
  );

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isErrorSchedulingOpen,
    onOpen: onErrorSchedulingOpen,
    onClose: onErrorSchedulingClose,
  } = useDisclosure();

  const onSubmitClick = async () => {
    next();
  };

  // const startDateLocal = new Date(currentSchedule.startTime);
  // const startTimeLocal = format(new Date(currentSchedule.startTime), "h:mm aa");
  // const endTimeLocal = format(new Date(currentSchedule.endTime), "h:mm aa");

  const dayText = (startDate: Date) => {
    return format(startDate, "eeee");
  };
  const dateText = (startDate: Date) => {
    return format(startDate, "MMMM d, yyyy");
  };
  const [foodRescue, setFoodRescue] = useState<Schedule>();
  const [checkIn, setCheckIn] = useState<CheckIn>();

  useEffect(() => {
    const getShiftDetails = async () => {
      if (isRescue) {
        const foodRescueResponse = await SchedulingAPIClient.getScheduleById(
          "4",
        );
        setFoodRescue(foodRescueResponse);
      } else {
        const checkInResponse = await CheckInAPIClient.getCheckInsById("2");
        setCheckIn(checkInResponse);
      }
    };
    getShiftDetails();
  }, [foodRescue, checkIn]);

  return (
    <Container variant="responsiveContainer">
      <>
        <BackButton previous={previous} />
        <SchedulingProgressBar activeStep={3} totalSteps={4} />
      </>

      <Text
        textStyle="mobileHeader2"
        mt="1em"
        direction="row"
        display={{ md: "flex" }}
        mb="1em"
      >
        Confirm shift sign up &nbsp;&nbsp;&nbsp;
      </Text>
      <Box
        pl="0"
        align="left"
        mt="2rem"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Box>
          <Text textStyle="mobileHeader3">Shift Details</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            You are signing up to volunteer for the following shift:
          </Text>
          {/* <Text textStyle="mobileBody">{dateText(startDateLocal)}</Text>
          <Text textStyle="mobileBody">
            {`${startTimeLocal} - ${endTimeLocal}`}
          </Text> */}
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Frequency
          </Text>
          <HStack spacing="4px">
            <Text textStyle="mobileBodyBold" color="hubbard.100">
              Frequency
            </Text>
            {/* <Text>
              {currentSchedule.frequency === DonationFrequency.WEEKLY
                ? ` on ${dayText(startDateLocal)}s`
                : ""}
            </Text> */}
          </HStack>
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Button
          pl="0"
          variant="edit"
          color="hubbard.100"
          onClick={() => go && go("donation information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader3">Donation Information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Size
          </Text>
          {/* <Text textStyle="mobileBody">{`${currentSchedule.size} - ${description}`}</Text> */}
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Item Category
          </Text>
          {/* <Text textStyle="mobileBody">
            {currentSchedule.categories.join(", ")}
          </Text> */}
        </Box>
      </Box>

      <Box
        pl="0"
        align="left"
        mb="2rem"
        display={{ sm: "flex" }}
        justifyContent="space-between"
        flexDirection="row-reverse"
      >
        <Button
          pl="0"
          variant="edit"
          color="hubbard.100"
          onClick={() => go && go("volunteer information")}
        >
          Edit
        </Button>
        <Box>
          <Text textStyle="mobileHeader3">Volunteer Information</Text>
          <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
            Volunteer Needed
          </Text>

          <Box>
            <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
              Additional notes
            </Text>
            <Text textStyle="mobileBody">notes</Text>
          </Box>
        </Box>
      </Box>

      <Box m="3em 0" pl="0" align="left">
        <Text textStyle="mobileHeader3">Donor Information</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Name
        </Text>
        <Text textStyle="mobileBody">
          {currentDonor.firstName} {currentDonor.lastName}
        </Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Email
        </Text>
        <Text textStyle="mobileBody">{currentDonor.email}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Phone
        </Text>
        <Text textStyle="mobileBody">{currentDonor.phoneNumber}</Text>
        <Text textStyle="mobileSmall" color="hubbard.100" pt="1.4em">
          Organization
        </Text>
        <Text textStyle="mobileBody">{currentDonor.businessName}</Text>
      </Box>

      <HStack>
        <Flex justify="flex-end">
          <Button onClick={onSubmitClick} variant="navigation">
            Submit
          </Button>
        </Flex>
        <ErrorSchedulingModal
          headerText="Donation could not be scheduled"
          bodyText=" Sorry, something went wrong with our system. Please try again."
          isOpen={isErrorSchedulingOpen}
          onClose={onErrorSchedulingClose}
        />
      </HStack>
    </Container>
  );
};

export default ConfirmShift;
