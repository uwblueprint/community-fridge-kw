import {
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Link as ReactLink } from "react-router-dom";

import { LOGIN_PAGE } from "../../constants/Routes";
import { MenuIcon } from "./icons";

const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container pt="0.5rem">
      <Flex>
        <IconButton
          w="24px"
          h="24px"
          flex="1"
          aria-label="menu options"
          onClick={onOpen}
          backgroundColor="transparent"
        >
          <MenuIcon />
        </IconButton>
        <Text pl="21px" flex="9">
          Community Fridge
        </Text>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent backgroundColor="evergreen.100">
          <DrawerBody>
            <Stack spacing="1rem">
              <Text color="squash.100" textStyle="mobileHeader4">
                Schedule Dropoff
              </Text>
              <Text color="squash.100" textStyle="mobileHeader4">
                <Link as={ReactLink} to={LOGIN_PAGE}>
                  Sign In
                </Link>
              </Text>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;