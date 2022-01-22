import { SearchIcon } from "@chakra-ui/icons";
import {
  Container,
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
import { DonorResponse } from "../../../types/DonorTypes";

const UserManagementPage = (): JSX.Element => {
  const [donors, setDonors] = React.useState([] as DonorResponse[]);
  const [search, setSearch] = React.useState("");

  const tableData = React.useMemo(() => {
    if (!search) return donors;
    return donors.filter(
      (donor) =>
        donor.businessName.toLowerCase().includes(search.toLowerCase()) ||
        donor.email.toLowerCase().includes(search.toLowerCase()) ||
        donor.firstName.toLowerCase().includes(search.toLowerCase()) ||
        donor.lastName.toLowerCase().includes(search.toLowerCase()) ||
        donor.phoneNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, donors]);

  React.useEffect(() => {
    const getDonors = async () => {
      const res = await DonorAPIClient.getAllDonors();
      setDonors(res);
    };

    getDonors();
  }, []);

  return (
    <Container variant="dashboardContainer">
      <Text mb="40px" textStyle="desktopHeader2">
        User Management
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
            <Th color="black.100"> Company</Th>
            <Th color="black.100">Point of Contact</Th>
            <Th color="black.100">Email</Th>
            <Th color="black.100">Phone Number</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((donor, key) => (
            <Tr key={key}>
              <Td>{donor.businessName}</Td>
              <Td>{`${donor.firstName} ${donor.lastName}`}</Td>
              <Td>{donor.email}</Td>
              <Td>{donor.phoneNumber}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default UserManagementPage;
