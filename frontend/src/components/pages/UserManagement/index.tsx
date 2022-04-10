import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import VolunteerAPIClient from "../../../APIClients/VolunteerAPIClient";
import { Role, Status } from "../../../types/AuthTypes";
import { DonorResponse } from "../../../types/DonorTypes";
import { VolunteerDTO, VolunteerResponse } from "../../../types/VolunteerTypes";
import {
  AccountFilterType,
  accountTypefilterOptions,
  UserMgmtTableRecord,
} from "./types";

const UserManagementPage = (): JSX.Element => {
  const [donors, setDonors] = React.useState([] as DonorResponse[]);
  const [volunteers, setVolunteers] = React.useState([] as VolunteerResponse[]);
  const [users, setUsers] = React.useState([] as UserMgmtTableRecord[]); // both donors and volunteers
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    AccountFilterType.ALL,
  );
  const [dataError, setDataError] = React.useState<boolean>(false);

  // Merge donors and volunteers into one list of type UserMgmtTableRecord
  const buildTableUsers = (): UserMgmtTableRecord[] => {
    const mergedUsers: UserMgmtTableRecord[] = [];

    volunteers.forEach(function (volunteer) {
      mergedUsers.push({
        userId: volunteer.userId,
        id: volunteer.id,
        pointOfContact: `${volunteer.firstName} ${volunteer.lastName}`,
        company: "",
        email: volunteer.email,
        phoneNumber: volunteer.phoneNumber,
        accountType: volunteer.role,
        approvalStatus: volunteer.status,
      });
    });

    donors.forEach(function (donor) {
      mergedUsers.push({
        userId: donor.userId,
        id: donor.id,
        pointOfContact: `${donor.firstName} ${donor.lastName}`,
        company: donor.businessName,
        email: donor.email,
        phoneNumber: donor.phoneNumber,
        accountType: donor.role,
        approvalStatus: "",
      });
    });

    return mergedUsers;
  };

  React.useEffect(() => {
    const getDonors = async () => {
      const res = await DonorAPIClient.getAllDonors();
      if (res.length === undefined) setDonors(res);
      else {
        setDataError(true);
      }
    };

    const getVolunteers = async () => {
      const res = await VolunteerAPIClient.getAllVolunteers();
      if (res.length === undefined) setVolunteers(res);
      else {
        setDataError(true);
      }
    };

    getDonors();
    getVolunteers();
  }, []);

  // Update users whenever donors or volunteers have a change
  React.useEffect(() => {
    setUsers(buildTableUsers());
  }, [donors, volunteers]);

  const tableData = React.useMemo(() => {
    let filteredUsers;
    if (selectedFilter === AccountFilterType.ALL) filteredUsers = users;
    else if (selectedFilter === AccountFilterType.VOLUNTEER)
      filteredUsers = users.filter(
        (user) => user.accountType === Role.VOLUNTEER,
      );
    // selectedFilter === AccountFilterType.DONOR
    else
      filteredUsers = users.filter((user) => user.accountType === Role.DONOR);

    if (!search) return filteredUsers;
    return filteredUsers.filter(
      (user) =>
        user.accountType.toLowerCase().includes(search.toLowerCase()) ||
        user.pointOfContact.toLowerCase().includes(search.toLowerCase()) ||
        user.company.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, users]);

  // Sets volunteer status to Approved
  const handleApprove = async (user: UserMgmtTableRecord) => {
    const newVolunteerData = { status: Status.APPROVED };
    const updatedVolunteerResponse: VolunteerDTO = await VolunteerAPIClient.updateVolunteerByUserId(
      user.userId,
      newVolunteerData,
    );
    if (updatedVolunteerResponse) {
      const newUsers: UserMgmtTableRecord[] = await users.map((u) => {
        if (u.id === updatedVolunteerResponse.id) {
          return { ...u, approvalStatus: Status.APPROVED };
        }
        return u;
      });
      setUsers(newUsers);
    }
  };

  // Deletes selected user
  const handleDeleteUser = async (user: UserMgmtTableRecord) => {
    const deleteUserResponse = await UserAPIClient.deleteUserById(user.userId);
    if (deleteUserResponse) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  // Selects a filter
  const handleSelectFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value.toString());
  };

  return (
    <Container variant="baseContainer">
      <Text mb="40px" textStyle="desktopHeader2">
        User management
      </Text>
      {dataError ? (
        <Text>Something went wrong with loading the data, please refresh the page and try again!</Text>
      ) : (
        <>
          <HStack>
            <InputGroup flex={4}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                enterKeyHint="enter"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a user"
                variant="customFilled"
              />
            </InputGroup>
            <Select
              flex={1}
              color="hubbard.100"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleSelectFilter(e);
              }}
            >
              {accountTypefilterOptions.map((option, key) => {
                return (
                  <option key={key} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </HStack>
          <Table colorScheme="blackAlpha" mt="30px">
            <Thead background="squash.100">
              <Tr>
                <Th color="black.100">Point of contact</Th>
                <Th color="black.100">Company</Th>
                <Th color="black.100">Email</Th>
                <Th color="black.100">Phone number</Th>
                <Th color="black.100">Account type</Th>
                <Th color="black.100">Approvals</Th>
                <Th color="black.100" />
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((user, key) => (
                <Tr key={key}>
                  <Td>{user.pointOfContact}</Td>
                  <Td>{user.company}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>{user.accountType}</Td>
                  <Td>
                    {user.accountType === Role.VOLUNTEER &&
                    user.approvalStatus !== Status.APPROVED ? (
                      <Button
                        variant="approve"
                        onClick={() => handleApprove(user)}
                      >
                        Approve
                      </Button>
                    ) : (
                      ""
                    )}
                  </Td>
                  <Td>
                    <IconButton
                      backgroundColor="transparent"
                      aria-label="Delete user"
                      icon={<DeleteIcon color="hubbard.100" />}
                      onClick={() => handleDeleteUser(user)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>{" "}
        </>
      )}
    </Container>
  );
};

export default UserManagementPage;
