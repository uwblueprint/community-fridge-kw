import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import communityFrigeLandingPageImage from "../../../assets/home_page_fridge.png";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import ViewDonations from "../AdminDashboard/ViewDonationsAndCheckIns";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser } = React.useContext(AuthContext);
  const toast = useToast();

  const onScheduleClick = () => {
    if (!authenticatedUser) {
      return history.push(Routes.LOGIN_PAGE);
    }

    return authenticatedUser?.role === Role.DONOR
      ? history.push(Routes.SCHEDULING_PAGE)
      : toast({
          title: "Please make a donor account to access",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
  };

  const onVolunteerClick = () => {
    if (!authenticatedUser) {
      return history.push(Routes.LOGIN_PAGE);
    }

    return authenticatedUser?.role === Role.VOLUNTEER
      ? history.push(Routes.VOLUNTEER_SHIFTS_PAGE)
      : toast({
          title: "Please make a volunteer account to access",
          status: "error",
          duration: 7000,
          isClosable: true,
        });
  };

  return (
    <>
      <Container variant="baseContainer">
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
            <Stack direction={["column", "row"]} width="100%">
              <Button size="md" onClick={onScheduleClick} variant="navigation">
                Schedule a food donation
              </Button>
              <Button size="md" onClick={onVolunteerClick} variant="outlined">
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
      </Container>
    </>
  );
};

export default Home;
