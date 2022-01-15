import { Container, Divider, Flex, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { Email, Facebook, Instagram } from "./icons";

const Footer = (): JSX.Element => (
  <>
    <Divider pt={{ base: "79px", md: "117px" }} />
    <Container
      maxWidth={{ base: "default", md: "70%", lg: "80%" }}
      py="4rem"
      pl={{ base: "2rem", md: "0px" }}
      pr={{ base: "4rem", md: "0px" }}
      display={{ md: "flex" }}
      justifyContent="space-evenly"
    >
      <VStack
        mt={{ base: 4, md: 0 }}
        align={{ md: "left" }}
        mr={{ base: "0px", md: "10%" }}
      >
        <Text textStyle="mobileHeader1">Community Fridge KW</Text>
        <Text mt={{ base: 4 }}>Take what you need, leave what you can.</Text>
      </VStack>

      <VStack
        mt={{ base: 4, md: 0 }}
        align={{ md: "left" }}
        mr={{ base: "0%", md: "10%" }}
      >
        <Text color="raddish.100" textStyle="mobileHeader3">
          Location
        </Text>
        <Text mt={{ base: 4 }}>
          Kitchener Market: <br />
          300 King Street East, <br />
          Kitchener, ON N2H 2V5 <br />
          (647) 607-1312
        </Text>
      </VStack>

      <VStack
        mt={{ base: "48px", md: 0 }}
        align={{ md: "left" }}
        mr={{ base: "0%", md: "10%" }}
      >
        <Text color="raddish.100" textStyle="mobileHeader3">
          Contact Us
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
    </Container>
  </>
);

export default Footer;
