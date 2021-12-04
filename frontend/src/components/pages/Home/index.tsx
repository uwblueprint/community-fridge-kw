import {
  Box,
  Flex,
  Button,
  Container,
  Image,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { SCHEDULING_PAGE } from "../../../constants/Routes";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

import communityFrigeLandingPageImage from "../../../assets/home_page_fridge.png";

const Home = (): JSX.Element => {
  const history = useHistory();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Container maxWidth={{ base: "default", md: "70%" }} px="42px" pt="73px">
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
          <Box>
            <Text align="left" marginBottom="13px" textStyle="mobileHeader1">
              Welcome to Community Fridge KW
            </Text>

            <Text marginBottom="30px" textStyle="mobileBody">
              Community fridges are public repositories of fresh, donated foods
              that anyone can take from for free.
            </Text>
            <Button
              size="lg"
              onClick={() => history.push(SCHEDULING_PAGE)}
              variant="navigation"
            >
              Schedule a food dropoff
            </Button>
          </Box>
          <Image
            objectFit="scale-down"
            display={{ base: "none", md: "inline" }}
            width="374px"
            height="338px"
            ml="5rem"
            src={communityFrigeLandingPageImage}
            alt="Community Fridge Image"
          />
        </Flex>
        <Box maxWidth={{ base: "default", md: "70%" }} marginLeft="-7.5rem">
          {/* TODO: Add back after styling fix <ViewDonations isPublicView /> */}
        </Box>
        <DonationProcess />
      </Container>
      <VolunteerRoles />
    </>
  );
};

export default Home;
