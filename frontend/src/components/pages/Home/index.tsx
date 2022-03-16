import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
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
import ViewDonations from "../ViewDonations";
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
          <Box width="100%">
            <Text align="left" marginBottom="13px" textStyle="mobileHeader1">
              Welcome to Community Fridge KW!
            </Text>

            <Text
              marginBottom="30px"
              textStyle="mobileBody"
              width={{ base: "100%", md: "50%" }}
            >
              We’re a grassroots mutual aid initiative committed to establishing
              public repositories of fresh food and essential items in
              Kitchener-Waterloo that anyone can take from for free, anytime.
            </Text>
            <Button
              size="lg"
              onClick={onScheduleClick}
              variant="navigation"
              width={{ base: "100%", md: "75%", xl: "30%" }}
            >
              Schedule a food donation
            </Button>
          </Box>
          <Image
            objectFit="scale-down"
            display={{ base: "none", md: "inline" }}
            width="374px"
            height="338px"
            ml="5rem"
            alignSelf="flex-end"
            src={communityFrigeLandingPageImage}
            alt="Community Fridge Image"
          />
        </Flex>
        <Box>
          <ViewDonations isAdminView={false} />
        </Box>
        <Divider
          color="hubbard.100"
          mt={{ base: "0px", md: "40px" }}
          opacity={{ base: "0%", md: "100%" }}
        />
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
