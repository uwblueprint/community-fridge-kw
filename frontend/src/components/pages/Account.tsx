import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  HStack,
  IconButton,
  Img,
  Input,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import DonorAPIClient from "../../APIClients/DonorAPIClient";
import pencilIcon from "../../assets/pencilIcon.svg";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedDonor } from "../../types/AuthTypes";

const Account = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [donor, setDonor] = useState({});

  React.useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    const getDonor = async () => {
      const res = await DonorAPIClient.getDonorByUserId(authenticatedUser.id);
      setDonor(res);
    };
    getDonor();
  }, [authenticatedUser]);

  const accountData = ({
    id: authenticatedUser!.id,
    firstName: authenticatedUser!.firstName,
    lastName: authenticatedUser!.lastName,
    email: authenticatedUser!.email,
    phoneNumber: authenticatedUser!.phoneNumber,
    businessName: donor.businessName,
  } as unknown) as AuthenticatedDonor;

  const [formValues, setForm] = useForm(accountData);

  const navigateToDashboard = () => {
    history.push(Routes.DASHBOARD_PAGE);
  };

  const changeEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    if (name === "businessName") {
      setBusinessName(e.toString());
    }
  };

  const EditInfoButton = (props: any) => {
    return !isEditing ? (
      <Button
        variant="editInfo"
        rightIcon={
          <Img
            src={pencilIcon}
            alt="pencil icon"
            width="12px"
            display="inline"
          />
        }
        onClick={changeEditMode}
      >
        Edit
      </Button>
    ) : (
      <IconButton
        variant="cancelEditInfo"
        aria-label="Cancel editing"
        icon={<CloseIcon />}
        onClick={changeEditMode}
      />
    );
  };

  if (!businessName) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <Container centerContent variant="responsiveContainer">
      <Box>
        <HStack align="flex-end">
          <Text mt="67px" textStyle="mobileHeader1">
            My Account
          </Text>
          <Spacer />
          <EditInfoButton />
        </HStack>

        <FormControl mt="2rem" isReadOnly={!isEditing}>
          <Text mb="1em" textStyle="mobileBodyBold" color="hubbard.100">
            Organization
          </Text>
          <Box>
            <Text>Name of business</Text>
            <Input
              mt="2"
              value={businessName}
              name="businessName"
              placeholder="Enter name of business"
              variant={isEditing ? "customFilled" : "unstyled"}
              onChange={(e) => handleChange(e.target.value, "businessName")}
            />
          </Box>
          <Text
            mt={{ base: "40px", md: "54px" }}
            mb="1em"
            textStyle="mobileBodyBold"
            color="hubbard.100"
          >
            Point of Contact
          </Text>
          <HStack spacing={{ base: "16px" }}>
            <Box>
              <Text>First name</Text>
              <Input
                mt="2"
                value={formValues!.firstName}
                name="firstName"
                placeholder="Enter first name"
                variant={isEditing ? "customFilled" : "unstyled"}
                onChange={(e) => handleChange(e.target.value, "firstName")}
              />
            </Box>
            <Box mt="2rem">
              <Text>Last name</Text>
              <Input
                mt="2"
                value={formValues!.lastName}
                name="lastName"
                placeholder="Enter last name"
                variant={isEditing ? "customFilled" : "unstyled"}
                onChange={(e) => handleChange(e.target.value, "lastName")}
              />
            </Box>
          </HStack>
          <Box mt={{ base: "24px", md: "40px" }}>
            <Text>Phone number</Text>
            <Input
              mt="2"
              type="tel"
              value={formValues!.phoneNumber}
              name="phoneNumber"
              placeholder="Enter phone number"
              variant={isEditing ? "customFilled" : "unstyled"}
              onChange={(e) => handleChange(e.target.value, "phoneNumber")}
            />
          </Box>
          <Box mt={{ base: "24px", md: "40px" }}>
            <Text>Email address</Text>
            <Input
              mt="2"
              value={formValues!.email}
              name="email"
              placeholder="Enter email"
              variant={isEditing ? "customFilled" : "unstyled"}
              onChange={(e) => handleChange(e.target.value, "email")}
            />
          </Box>
          <Box mt={{ base: "66px", md: "56px" }}>
            <Button
              width="100%"
              size="lg"
              mt="2"
              variant="navigation"
              onClick={navigateToDashboard}
            >
              View Scheduled Donations
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Container>
  );
};

export default Account;
