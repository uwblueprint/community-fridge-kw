import {
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

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
        />
        <Text pl="21px" flex="9">
          Community Fridge
        </Text>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Community Fridge</DrawerHeader>
          <DrawerBody>
            <Stack spacing="1rem">
              <Text textStyles="subHeading">Schedule Dropoff</Text>
              <Text textStyles="subHeading">Contact Admin</Text>
              <Text textStyles="subHeading">Sign In</Text>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
