import { Container, Divider, Flex, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { Email, Facebook, Instagram } from "./icons";

const Footer = (): JSX.Element => (
  <>
    <Divider pt={{ base: "0px", md: "79px" }} />
    <Container
      pt="4rem"
      pb="6rem"
      display={{ md: "flex" }}
      justifyContent="space-between"
      variant="baseContainer"
    >
      <VStack
        mt={{ base: 4, md: 0 }}
        align={{ md: "left" }}
        mr={{ base: "0px", md: "10%" }}
      >
        <Text textStyle="desktopHeader3">Community Fridge KW</Text>
        <Text mt={{ base: 4 }}>Take what you need, leave what you can.</Text>
      </VStack>

      <VStack
        mt={{ base: 4, md: 0 }}
        align={{ md: "left" }}
        mr={{ base: "0%", md: "10%" }}
      >
        <Text color="raddish.100" textStyle="desktopSubtitle">
          Location
        </Text>
        <Text mt={{ base: 4 }} textStyle="desktopBody">
          Kitchener Market: <br />
          300 King Street East, <br />
          Kitchener, ON N2H 2V5 <br />
          (647) 607-1312
        </Text>
      </VStack>

      <VStack mt={{ base: "48px", md: 0 }} align={{ md: "left" }}>
        <Text color="raddish.100" textStyle="desktopSubtitle">
          Contact Us
        </Text>
        <Flex mt={{ base: 4 }}>
          <Link
            href="https://www.facebook.com/CommunityFridgeKW/"
            display="flex"
            flexDirection="row"
          >
            <Facebook />
            <Text ml="8px">Facebook</Text>
          </Link>
        </Flex>
        <Flex mt={{ base: 4 }}>
          <Link
            href="https://www.instagram.com/communityfridgekw/"
            display="flex"
            flexDirection="row"
          >
            <Instagram />
            <Text ml="8px">Instagram</Text>
          </Link>
        </Flex>
        <Flex mt={{ base: 4 }}>
          <Link
            href="mailto:communityfridgekw@gmail.com"
            display="flex"
            flexDirection="row"
          >
            <Email />
            <Text ml="8px">Email</Text>
          </Link>
        </Flex>
      </VStack>
    </Container>
  </>
);

export default Footer;
