import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [hoveredItem, setHoveredItem] = useState("");
  const history = useHistory();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      history.push(Routes.LANDING_PAGE);
      setAuthenticatedUser(null);
    }
    onClose();
  };

  const menuItemStyle = {
    borderRadius: "0.4rem",
    margin: "auto",
    width: "95%",
  };

  const hoverMenuItemStyle = {
    borderRadius: "0.4rem",
    margin: "auto",
    width: "95%",
    backgroundColor: "#C24A84",
    color: "white",
  };

  return (
    <Container variant="headerContainer">
      <Flex
        pt={{ base: "0.5rem", md: "2rem" }}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        float={{ base: "left", md: "none" }}
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
                    My scheduled donations
                  </Link>
                </>
              )}
              {authenticatedUser.role === Role.VOLUNTEER && (
                <>
                  <Link
                    as={ReactLink}
                    to={Routes.LANDING_PAGE}
                    onClick={onClose}
                  >
                    Home
                  </Link>
                  <Link as={ReactLink} to={Routes.VOLUNTEER_SHIFTS_PAGE}>
                    My Volunteer Shifts
                  </Link>
                </>
              )}
              {authenticatedUser.role === Role.ADMIN && (
                <>
                  <Menu closeOnBlur>
                    {({ isOpen: isNavDropdownOpen }) => (
                      <>
                        <MenuButton isActive={isNavDropdownOpen}>
                          Fridge management{" "}
                          {isNavDropdownOpen ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )}
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            as={ReactLink}
                            to={Routes.ADMIN_CHECK_INS}
                            style={
                              hoveredItem === "checkIns"
                                ? hoverMenuItemStyle
                                : menuItemStyle
                            }
                            _focus={{
                              bg: "raddish.50",
                            }}
                            _active={{
                              bg: "raddish.50",
                            }}
                            onClick={() => setHoveredItem("checkIns")}
                          >
                            Fridge check-ins
                          </MenuItem>
                          <MenuItem
                            as={ReactLink}
                            to={Routes.ADMIN_VIEW_DONATIONS}
                            style={
                              hoveredItem === "scheduledDonations"
                                ? hoverMenuItemStyle
                                : menuItemStyle
                            }
                            _focus={{
                              bg: "raddish.50",
                            }}
                            _active={{
                              bg: "raddish.50",
                            }}
                            onClick={() => setHoveredItem("scheduledDonations")}
                          >
                            Scheduled donations
                          </MenuItem>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <Link as={ReactLink} to={Routes.USER_MANAGEMENT_PAGE}>
                    User management
                  </Link>
                </>
              )}
              <Link as={ReactLink} to={Routes.ACCOUNT_PAGE}>
                My account
              </Link>
              <Button
                onClick={onLogOutClick}
                variant="link"
                color="black"
                fontWeight="400"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                as={ReactLink}
                to={Routes.LANDING_PAGE}
                style={{ lineHeight: "2.5" }}
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
                Sign in
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
                      <Link
                        as={ReactLink}
                        to={Routes.DASHBOARD_PAGE}
                        onClick={onClose}
                      >
                        My scheduled donations
                      </Link>
                    </>
                  )}
                  {authenticatedUser.role === Role.VOLUNTEER && (
                    <>
                      <Link
                        as={ReactLink}
                        to={Routes.LANDING_PAGE}
                        onClick={onClose}
                      >
                        Home
                      </Link>
                      <Link
                        as={ReactLink}
                        to={Routes.VOLUNTEER_SHIFTS_PAGE}
                        onClick={onClose}
                      >
                        My volunteer shifts
                      </Link>
                    </>
                  )}
                  {authenticatedUser.role === Role.ADMIN && (
                    <>
                      <Link
                        as={ReactLink}
                        to={Routes.ADMIN_CHECK_INS}
                        onClick={onClose}
                      >
                        Fridge check-ins
                      </Link>
                      <Link
                        as={ReactLink}
                        to={Routes.ADMIN_VIEW_DONATIONS}
                        onClick={onClose}
                      >
                        Scheduled donations
                      </Link>
                      <Link
                        as={ReactLink}
                        to={Routes.USER_MANAGEMENT_PAGE}
                        onClick={onClose}
                      >
                        User management
                      </Link>
                    </>
                  )}
                  <Link
                    as={ReactLink}
                    to={Routes.ACCOUNT_PAGE}
                    onClick={onClose}
                  >
                    My account
                  </Link>
                  <Button
                    onClick={onLogOutClick}
                    variant="link"
                    position="fixed"
                    bottom="30px"
                    color="black"
                    fontWeight="400"
                  >
                    Log out
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
                    Sign in
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
