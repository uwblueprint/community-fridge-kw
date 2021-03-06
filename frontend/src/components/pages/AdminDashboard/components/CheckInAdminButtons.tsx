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
import { Link as ReactLink, useHistory } from "react-router-dom";

import menuIcon from "../../../../assets/menuIcon.svg";
import * as Routes from "../../../../constants/Routes";
import { downloadCSV } from "../../../../utils/CSVUtils";
import { getCheckInCSVData } from "../getCSVData";

const CheckInAdminButtons = () => {
  const history = useHistory();

  const handleCSVDownload = async () => {
    const csvCheckInData = await getCheckInCSVData();
    downloadCSV(csvCheckInData, "checkins");
  };

  return (
    <>
      <Show above="md">
        <Stack direction="row" spacing={4} pt="30px">
          <Button
            size="md"
            onClick={() => {
              history.push(Routes.CREATE_CHECKIN);
            }}
            variant="create"
            px="20px"
            lineHeight="20px"
          >
            + Create
          </Button>

          <Button
            size="md"
            onClick={() => history.push(Routes.ADMIN_DELETE_CHECK_INS)}
            variant="export"
            leftIcon={<DeleteIcon />}
            px="20px"
          >
            Delete
          </Button>
          <Button
            size="md"
            onClick={handleCSVDownload}
            variant="export"
            leftIcon={<DownloadIcon />}
            px="20px"
          >
            Export
          </Button>
        </Stack>
      </Show>

      <Show below="md">
        <HStack mt="3.5rem" spacing="7px">
          <Button
            size="sm"
            onClick={() => {
              history.push(Routes.CREATE_CHECKIN);
            }}
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
              <MenuItem
                _hover={{ bg: "dorian.100" }}
                onClick={handleCSVDownload}
              >
                <Text textStyle="mobileSmall" color="hubbard.100">
                  Export
                </Text>
              </MenuItem>
              <MenuItem
                _hover={{ bg: "dorian.100" }}
                as={ReactLink}
                to={Routes.ADMIN_DELETE_CHECK_INS}
              >
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
