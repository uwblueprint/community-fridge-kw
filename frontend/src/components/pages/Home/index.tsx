import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import communityFrigeLandingPageImage from "../../../assets/home_page_fridge.png";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import GeneralErrorModal from "../../common/GeneralErrorModal";
import ViewDonations from "../AdminDashboard/ViewDonationsAndCheckIns";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser } = React.useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onScheduleClick = () => {
    if (authenticatedUser?.role === Role.ADMIN) {
      onOpen();
    } else {
      history.push(Routes.SCHEDULING_PAGE);
    }
  };

  const onVolunteerClick = () => {
    if (authenticatedUser?.role === Role.ADMIN) {
      onOpen();
    } else {
      history.push(Routes.VOLUNTEER_SHIFTS_PAGE);
    }
  };

  return (
    <>
      <Container variant="baseContainer">
        <Image
          src="drawer-logo.png"
          alt="Community Fridge logo"
          borderRadius="100px"
          marginRight="50%"
          maxWidth="145px"
          maxHeight="145px"
          display={{ base: "inline", md: "none" }}
        />
        <Flex>
          <Box width="100%" mt="1rem">
            <Text align="left" marginBottom="13px" textStyle="mobileHeader1">
              Welcome to Community Fridge KW
            </Text>

            <Text marginBottom="30px" textStyle="mobileBody" width="100%">
              We’re a grassroots mutual aid initiative committed to establishing
              public repositories of fresh food and essential items in
              Kitchener-Waterloo that anyone can take from for free, anytime.
            </Text>
            <Stack direction={["column", "row"]} width="90%">
              <Button size="lg" onClick={onScheduleClick} variant="navigation">
                Schedule a food donation
              </Button>
              <Button size="lg" onClick={onVolunteerClick} variant="outlined">
                Volunteer for the fridge
              </Button>
            </Stack>
          </Box>
          <Image
            objectFit="scale-down"
            display={{ base: "none", md: "inline" }}
            height="260px"
            ml="5rem"
            alignSelf="flex-end"
            src={communityFrigeLandingPageImage}
            alt="Community Fridge Image"
          />
        </Flex>
        <Divider mt="3rem" mb="2rem" />
        <Box>
          <ViewDonations isAdminView={false} />
        </Box>
        <DonationProcess />
        <VolunteerRoles />
        <GeneralErrorModal
          isOpen={isOpen}
          onClose={onClose}
          headerText="Access Error"
          bodyText="You do not have access to this function, please create a donor account to schedule a donation."
        />
      </Container>
    </>
  );
};

export default Home;
