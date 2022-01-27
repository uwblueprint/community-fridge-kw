import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Link,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
    }
    onClose();
  };

  return (
    <Container pt="1.5rem" variant="baseContainer">
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
          <HamburgerIcon color="black.100" />
        </IconButton>
        <Link as={ReactLink} to={Routes.LANDING_PAGE}>
          <Image
            objectFit="none"
            src="header-logo.png"
            alt="Community Fridge logo"
            display="inline"
          />
        </Link>
        <Stack
          spacing="2rem"
          direction="row"
          display={{ base: "none", md: "flex" }}
        >
          {authenticatedUser ? (
            <>
              {authenticatedUser.role === Role.DONOR && (
                <>
                  <Link
                    as={ReactLink}
                    to={Routes.LANDING_PAGE}
                    onClick={onClose}
                  >
                    Home
                  </Link>
                  <Link as={ReactLink} to={Routes.DASHBOARD_PAGE}>
                    Scheduled Donations
                  </Link>
                </>
              )}
              {authenticatedUser.role === Role.ADMIN && (
                <>
                  <Link as={ReactLink} to={Routes.USER_MANAGEMENT_PAGE}>
                    User Management
                  </Link>
                  <Link as={ReactLink} to={Routes.VIEW_DONATIONS}>
                    View Donations
                  </Link>
                </>
              )}
              <Link as={ReactLink} to={Routes.ACCOUNT_PAGE}>
                My Account
              </Link>
              <Button
                onClick={onLogOutClick}
                variant="link"
                color="black"
                fontWeight="400"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link as={ReactLink} to={Routes.LANDING_PAGE} onClick={onClose}>
                Home
              </Link>
              <Button
                variant="navigation"
                onClick={() => {
                  history.push(Routes.LOGIN_PAGE);
                  onClose();
                }}
              >
                Sign In
              </Button>
            </>
          )}
        </Stack>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent backgroundColor="squash.100">
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
              <CloseIcon color="black.100" />
            </IconButton>
            <Image
              w="120px"
              mt="70px"
              ml="20px"
              mb="30px"
              src="drawer-logo.png"
              alt="Community Fridge logo"
            />
            <Stack spacing="1rem" ml="20px">
              {authenticatedUser ? (
                <>
                  {authenticatedUser.role === Role.DONOR && (
                    <>
                      <Link
                        as={ReactLink}
                        to={Routes.LANDING_PAGE}
                        onClick={onClose}
                      >
                        Home
                      </Link>
                      <Link as={ReactLink} to={Routes.DASHBOARD_PAGE}>
                        Scheduled Donations
                      </Link>
                    </>
                  )}
                  {authenticatedUser.role === Role.ADMIN && (
                    <>
                      <Link as={ReactLink} to={Routes.USER_MANAGEMENT_PAGE}>
                        User Management
                      </Link>
                      <Link as={ReactLink} to={Routes.VIEW_DONATIONS}>
                        View Donations
                      </Link>
                    </>
                  )}
                  <Link
                    as={ReactLink}
                    to={Routes.ACCOUNT_PAGE}
                    onClick={onClose}
                  >
                    My Account
                  </Link>
                  <Button
                    onClick={onLogOutClick}
                    variant="link"
                    position="fixed"
                    bottom="30px"
                    color="black"
                    fontWeight="400"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    as={ReactLink}
                    to={Routes.LANDING_PAGE}
                    onClick={onClose}
                  >
                    Home
                  </Link>
                  <Button
                    variant="navigation"
                    onClick={() => {
                      history.push(Routes.LOGIN_PAGE);
                      onClose();
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default Header;
