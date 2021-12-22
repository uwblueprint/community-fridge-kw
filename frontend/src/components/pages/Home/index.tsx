import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import communityFrigeLandingPageImage from "../../../assets/home_page_fridge.png";
import * as Routes from "../../../constants/Routes";
import DonationProcess from "./DonationProcess";
import VolunteerRoles from "./VolunteerRoles";

const Home = (): JSX.Element => {
  const history = useHistory();

  return (
    <>
      <Container
        maxWidth={{ base: "default", md: "70%" }}
        px={{ base: "42px", md: "0px" }}
        pt={{ base: "55px", md: "121px" }}
      >
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
              that anyone can take from for free. Community fridges are public
              repositories of fresh, donated foods.
            </Text>
            <Button
              size="lg"
              onClick={() => history.push(Routes.SCHEDULING_PAGE)}
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
            alignSelf="flex-end"
            src={communityFrigeLandingPageImage}
            alt="Community Fridge Image"
          />
        </Flex>
        <Box maxWidth={{ base: "default", md: "70%" }} marginLeft="-7.5rem">
          {/* TODO: Add back after styling fix <ViewDonations isPublicView /> */}
        </Box>
        <Divider
          color="hubbard.100"
          mt={{ base: "0px", md: "40px" }}
          opacity={{ base: "0%", md: "100%" }}
        />
        <DonationProcess />
        <VolunteerRoles />
      </Container>
    </>
  );
};

export default Home;
