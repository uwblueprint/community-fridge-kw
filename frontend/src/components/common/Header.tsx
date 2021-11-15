import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import {
  HOME_PAGE,
  LANDING_PAGE,
  LOGIN_PAGE,
  SCHEDULING_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { CloseIcon, MenuIcon } from "./icons";

const Header = (): JSX.Element => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
      history.push(LANDING_PAGE);
    }
  };

  return (
    <Container pt="0.5rem" maxWidth={{ base: "default", md: "70%" }}>
      <Flex
        pt={{ base: "0.5rem", md: "2rem" }}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        display={{ base: "inline", md: "flex" }}
      >
        <IconButton
          w="24px"
          h="24px"
          flex="1"
          aria-label="menu options"
          onClick={onOpen}
          backgroundColor="transparent"
          display={{ base: "inline", md: "none" }}
        >
          <MenuIcon />
        </IconButton>
        <Image
          objectFit="none"
          src="header-logo.png"
          alt="Community Fridge logo"
          display="inline"
        />
        <Stack
          spacing="2rem"
          direction="row"
          display={{ base: "none", md: "flex" }}
        >
          <Text>
            <Link as={ReactLink} to={LANDING_PAGE}>
              Home
            </Link>
          </Text>
          <Text>
            <Link as={ReactLink} to={SCHEDULING_PAGE}>
              Schedule Donation
            </Link>
          </Text>
          {authenticatedUser && (
            <>
              <Text>
                <Link as={ReactLink} to={LANDING_PAGE}>
                  {" "}
                  {/* update this to account page */}
                  My Account
                </Link>
              </Text>
              <Button onClick={onLogOutClick} variant="link" color="black">
                <Text>Log Out</Text>
              </Button>
            </>
          )}
          {!authenticatedUser && (
            <Text>
              <Link as={ReactLink} to={LOGIN_PAGE}>
                Sign In
              </Link>
            </Text>
          )}
        </Stack>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent backgroundColor="evergreen.100">
          <DrawerBody>
            <IconButton
              w="24px"
              h="24px"
              float="right"
              mt="15px"
              aria-label="close drawer"
              backgroundColor="transparent"
              onClick={onClose}
            >
              <CloseIcon color="white" />
            </IconButton>
            <Image
              mt="70px"
              mb="30px"
              src="drawer-logo.png"
              alt="Community Fridge logo"
            />
            <Stack spacing="1rem">
              <Text color="squash.100" textStyle="mobileHeader4">
                <Link as={ReactLink} to={LANDING_PAGE}>
                  Home
                </Link>
              </Text>
              <Text color="squash.100" textStyle="mobileHeader4">
                <Link as={ReactLink} to={SCHEDULING_PAGE}>
                  Schedule Donation
                </Link>
              </Text>
              {authenticatedUser && (
                <Text color="squash.100" textStyle="mobileHeader4">
                  <Link as={ReactLink} to={LANDING_PAGE}>
                    {" "}
                    {/* update this to account page */}
                    My Account
                  </Link>
                </Text>
              )}
              {!authenticatedUser && (
                <Text color="squash.100" textStyle="mobileHeader4">
                  <Link as={ReactLink} to={LOGIN_PAGE}>
                    Sign In
                  </Link>
                </Text>
              )}
            </Stack>
            {authenticatedUser && (
              <Button
                onClick={onLogOutClick}
                variant="link"
                position="fixed"
                bottom="20px"
              >
                <Text color="squash.100" textStyle="mobileHeader4">
                  Log Out
                </Text>
              </Button>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
