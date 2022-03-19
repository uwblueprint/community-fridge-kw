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
import { VolunteerResponse } from "../../../types/VolunteerTypes";
import { UserMgmtTableRecord } from "./types";

const UserManagementPage = (): JSX.Element => {
  const [donors, setDonors] = React.useState([] as DonorResponse[]);
  const [volunteers, setVolunteers] = React.useState([] as VolunteerResponse[]);
  const [users, setUsers] = React.useState([] as UserMgmtTableRecord[]); // both donors and volunteers
  const [search, setSearch] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [dataChanged, setDataChanged] = React.useState<0 | 1>(0);

  const filterOptions = [
    {
      value: "all",
      label: "All accounts",
    },
    {
      value: "volunteers",
      label: "Volunteers",
    },
    {
      value: "donors",
      label: "Donors",
    },
  ];

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
      setDonors(res);
    };

    const getVolunteers = async () => {
      const res = await VolunteerAPIClient.getAllVolunteers();
      setVolunteers(res);
    };

    getDonors();
    getVolunteers();
  }, [dataChanged]);

  // Update users whenever donors or volunteers have a change
  React.useEffect(() => {
    setUsers(buildTableUsers());
  }, [donors, volunteers]);

  const tableData = React.useMemo(() => {
    let filteredUsers;
    if (selectedFilter === "all") filteredUsers = users;
    else if (selectedFilter === "volunteers")
      filteredUsers = users.filter(
        (user) => user.accountType === Role.VOLUNTEER,
      );
    else
      filteredUsers = users.filter((user) => user.accountType === Role.DONOR);

    if (!search) return filteredUsers;
    return users.filter(
      (user) =>
        user.pointOfContact.toLowerCase().includes(search.toLowerCase()) ||
        user.company.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, selectedFilter, users]);

  // Sets volunteer status to Approved
  const handleApprove = (user: UserMgmtTableRecord) => {
    const newVolunteerData = { status: Status.APPROVED };
    const updatedVolunteer = VolunteerAPIClient.updateVolunteerById(
      user.id,
      newVolunteerData,
    );
    setDataChanged(dataChanged === 0 ? 1 : 0);
    console.log(dataChanged);
  };

  // Deletes selected user
  const handleDeleteUser = (user: UserMgmtTableRecord) => {
    const updatedUser = UserAPIClient.deleteUserById(user.userId);
    setDataChanged(dataChanged === 0 ? 1 : 0);
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
          {filterOptions.map((option, key) => {
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
                  <Button variant="approve" onClick={() => handleApprove(user)}>
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
      </Table>
    </Container>
  );
};

export default UserManagementPage;
