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

const MenuIcon = (): JSX.Element => (
  <Icon viewBox="0 0 24 24">
    <path d="M3 12H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 6H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 18H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

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
          <DrawerHeader textStyles="body">Community Fridge</DrawerHeader>
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
