import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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

  // Merge donors and volunteers into one list of type UserMgmtTableRecord
  const buildTableUsers = (): UserMgmtTableRecord[] => {
    const mergedUsers: UserMgmtTableRecord[] = [];

    volunteers.forEach(function (volunteer) {
      mergedUsers.push({
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
  }, []);

  // Update users whenever donors or volunteers have a change
  React.useEffect(() => {
    setUsers(buildTableUsers());
  }, [donors, volunteers]);

  const tableData = React.useMemo(() => {
    if (!search) return users;
    return users.filter(
      (user) =>
        user.pointOfContact.toLowerCase().includes(search.toLowerCase()) ||
        user.company.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);

  // Sets volunteer status to Approved
  const handleApprove = () => {
    // TODO: Call VolunteerAPIClient and update status
  };

  // Deletes selected user
  const handleDeleteUser = () => {
    // TODO: Get id of selected user and call UserAPIClient to delete user
  };

  return (
    <Container variant="baseContainer">
      <Text mb="40px" textStyle="desktopHeader2">
        User management
      </Text>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          enterKeyHint="enter"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a user"
        />
      </InputGroup>

      <Table colorScheme="blackAlpha" mt="30px">
        <Thead>
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
                  <Button variant="approve" onClick={handleApprove}>
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
                  onClick={handleDeleteUser}
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
