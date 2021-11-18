import { Box, Container, Flex, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { Email, Facebook, Instagram } from "./icons";

const Footer = (): JSX.Element => {
  return (
    <Container p={{ base: "1.5rem" }}>
      <Box display={{ md: "flex" }}>
        <VStack
          mt={{ base: 4, md: 0 }}
          align={{ md: "left" }}
          mr={{ base: "10%", lg: "10%", md: "0%", sm: "0%" }}
        >
          <Text textStyle="mobileHeader1">Community Fridge</Text>
          <Text mt={{ base: 4 }}>
            Helping facilitate access to food and reduce food waste
          </Text>
        </VStack>

        <VStack
          mt={{ base: 4, md: 0 }}
          align={{ md: "left" }}
          mr={{ base: "10%", lg: "10%", md: "0%", sm: "0%" }}
        >
          <Text color="raddish.100" textStyle="mobileHeader3">
            Location
          </Text>
          <Text mt={{ base: 4 }}>
            The Kitchener Market: <br />
            300 King Street East, <br />
            Kitchener, ON N2H 2V5 <br />
            (647) 607-1312
          </Text>
        </VStack>

        <VStack
          mt={{ base: 4, md: 0 }}
          align={{ md: "left" }}
          mr={{ base: "10%", lg: "10%", md: "0%", sm: "0%" }}
        >
          <Text color="raddish.100" textStyle="mobileHeader3">
            Follow Us
          </Text>
          <Flex mt={{ base: 4 }}>
            <Link href="https://www.facebook.com/CommunityFridgeKW/">
              <Facebook />
            </Link>
            <Container>
              <Text>Facebook</Text>
            </Container>
          </Flex>
          <Flex mt={{ base: 4 }}>
            <Link href="https://www.instagram.com/communityfridgekw/">
              <Instagram />
            </Link>
            <Container>
              <Text>Instagram</Text>
            </Container>
          </Flex>
          <Flex mt={{ base: 4 }}>
            <Link href="mailto:communityfridgekw@gmail.com">
              <Email />
            </Link>
            <Container>
              <Text>Email</Text>
            </Container>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

export default Footer;
