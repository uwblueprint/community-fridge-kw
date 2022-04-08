import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import menuIcon from "../../../../assets/menuIcon.svg";
import * as Routes from "../../../../constants/Routes";

const CheckInAdminButtons = () => {
  const history = useHistory();

  return (
    <>
      <Show above="md">
        <Stack direction="row" spacing={4}>
          <Button
            size="md"
            onClick={() => {
              history.push(Routes.CREATE_CHECKIN);
            }}
            variant="create"
            width="2.5rem"
            lineHeight="20px"
          >
            + Create
          </Button>

          <Button
            size="md"
            onClick={() => {}}
            variant="export"
            leftIcon={<DeleteIcon />}
            width="2.5rem"
          >
            Delete
          </Button>
          <Button
            size="md"
            onClick={() => {}}
            variant="export"
            leftIcon={<DownloadIcon />}
            width="2.5rem"
          >
            Export
          </Button>
        </Stack>
      </Show>

      <Show below="md">
        <HStack mt="3.5rem" spacing="7px">
          <Button
            size="sm"
            onClick={() => {}}
            variant="create"
            width="100%"
            lineHeight="20px"
            height="42px"
            py="12px"
          >
            + Create
          </Button>
          <Menu placement="bottom-end" size="xs">
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={
                <Img
                  display="inline"
                  src={menuIcon}
                  alt="menu icon"
                  width="24px"
                />
              }
              variant="export"
              pl="7px"
              pr="13px"
              height="44px"
            />
            <MenuList>
              <MenuItem hover={{ bg: "dorian.100" }}>
                <Text textStyle="mobileSmall" color="hubbard.100">
                  Export
                </Text>
              </MenuItem>
              <MenuItem _hover={{ bg: "dorian.100" }}>
                <Text textStyle="mobileSmall" color="hubbard.100">
                  Delete
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Show>
    </>
  );
};

export default CheckInAdminButtons;
