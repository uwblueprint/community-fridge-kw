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
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

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
        <DrawerContent>
          <DrawerHeader textStyle="body">Community Fridge</DrawerHeader>
          <DrawerBody>
            <Stack spacing="1rem">
              <Text textStyle="subHeading">Schedule Dropoff</Text>
              <Text textStyle="subHeading">Contact Admin</Text>
              <Text textStyle="subHeading">Sign In</Text>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
