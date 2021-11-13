import {
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { Facebook, Instagram } from "./icons";

const Footer = (): JSX.Element => {
  const [isLargerThan375] = useMediaQuery("(min-width: 400px)");
  return (
    <Container pt="24px">
      <VStack>
        {isLargerThan375 ? (
          <Flex>
            <VStack pr="312px">
              <Container>
                <Text
                  marginBottom="24px"
                  textStyle="mobileHeader1"
                  color="raddish.100"
                >
                  Community Fridge
                </Text>
                <Text>
                  The Kitchener Market: <br />
                  300 King Street East, <br />
                  Kitchener, ON N2H 2V5 <br />
                  (647) 607-1312 <br />
                  communityfridgekw@gmail.com
                </Text>
              </Container>
            </VStack>
            <VStack>
              <Text textStyle="mobileHeader2">Stay Updated!</Text>
              <HStack>
                <Link
                  href="https://www.facebook.com/CommunityFridgeKW/"
                  pr="18px"
                >
                  <Facebook />
                </Link>
                <Link href="https://www.instagram.com/communityfridgekw/">
                  <Instagram />
                </Link>
              </HStack>
            </VStack>
          </Flex>
        ) : (
          <>
            <Container>
              <Text
                marginBottom="24px"
                textStyle="mobileHeader1"
                color="raddish.100"
              >
                Community Fridge
              </Text>
              <Text>
                The Kitchener Market: <br />
                300 King Street East, <br />
                Kitchener, ON N2H 2V5 <br />
                (647) 607-1312 <br />
                communityfridgekw@gmail.com
              </Text>
            </Container>
            <Text textStyle="mobileHeader2">Stay Updated!</Text>
            <HStack>
              <Link
                href="https://www.facebook.com/CommunityFridgeKW/"
                pr="18px"
              >
                <Facebook />
              </Link>
              <Link href="https://www.instagram.com/communityfridgekw/">
                <Instagram />
              </Link>
            </HStack>
          </>
        )}

        <Text pt="78px">© Community Fridge KW 2021</Text>
      </VStack>
    </Container>
  );
};

export default Footer;
