import {
  Container,
  Flex,
  Link,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { Facebook, Instagram } from "./icons";

const Footer = (): JSX.Element => {
  const [isScreenLargerThan] = useMediaQuery("(min-width: 320px)");
  return (
    <Container pt="24px">
      <VStack>
        {isScreenLargerThan ? (
          <>
            <Flex>
              <VStack pr="100px">
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
              <Container>
                <Text textStyle="mobileHeader2">Stay Updated!</Text>
                <br />
                <Link
                  href="https://www.facebook.com/CommunityFridgeKW/"
                  pr="18px"
                >
                  <Facebook />
                </Link>
                <Link href="https://www.instagram.com/communityfridgekw/">
                  <Instagram />
                </Link>
              </Container>
            </Flex>
            <Text pt="24px">© Community Fridge KW 2021</Text>
          </>
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
            <Container>
              <Text pt="18px" textStyle="mobileHeader2">
                Stay Updated!
              </Text>
            </Container>
            <Container>
              <Link
                href="https://www.facebook.com/CommunityFridgeKW/"
                pr="18px"
              >
                <Facebook />
              </Link>
              <Link href="https://www.instagram.com/communityfridgekw/">
                <Instagram />
              </Link>
            </Container>
            <Container>
              <Text pt="8px">© Community Fridge KW 2021</Text>
            </Container>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Footer;
