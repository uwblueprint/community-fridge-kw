import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Img,
  Input,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import AuthAPIClient from "../../APIClients/AuthAPIClient";
import DonorAPIClient from "../../APIClients/DonorAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import pencilIcon from "../../assets/pencilIcon.svg";
import { AUTHENTICATED_USER_KEY } from "../../constants/AuthConstants";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { DonorResponse } from "../../types/DonorTypes";
import { setLocalStorageObjProperty } from "../../utils/LocalStorageUtils";
import EditAccountModal from "../common/UserManagement/EditAccountModal";
import ErrorMessages from "./Scheduling/ErrorMessages";

const Account = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState("");
  const [donor, setDonor] = useState<DonorResponse>();
  const [isSavingData, setIsSavingData] = useState(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (!authenticatedUser) {
      return;
    }
    const getDonor = async () => {
      let donorResponse: DonorResponse = {
        id: "",
        businessName: "",
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        phoneNumber: "",
        userId: "",
      };
      if (authenticatedUser.role === Role.ADMIN) {
        const userResponse = await UserAPIClient.getUserById(
          authenticatedUser.id,
        );
        donorResponse = {
          ...userResponse,
          businessName: "Community Fridge KW",
          firstName: "Admin",
          lastName: "Admin",
          userId: "",
        };
      } else {
        donorResponse = await DonorAPIClient.getDonorByUserId(
          authenticatedUser.id,
        );
      }
      setDonor(donorResponse);
      setBusinessName(
        authenticatedUser?.role !== Role.VOLUNTEER
          ? donorResponse.businessName
          : "",
      );
    };
    if (authenticatedUser?.role !== Role.VOLUNTEER) getDonor();
  }, [authenticatedUser]);

  const accountData = {
    firstName: authenticatedUser!.firstName,
    lastName: authenticatedUser!.lastName,
    email: authenticatedUser!.email,
    phoneNumber: authenticatedUser!.phoneNumber,
  };

  const [formValues, setForm] = useForm(accountData);
  const [formErrors, setFormErrors] = useState<{
    businessName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>({
    businessName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const navigateToDashboard = () => {
    history.push(
      authenticatedUser!.role === Role.ADMIN
        ? Routes.ADMIN_CHECK_INS
        : Routes.DASHBOARD_PAGE,
    );
  };

  const onResetPasswordClick = async () => {
    const success = await AuthAPIClient.logout(authenticatedUser?.id);
    if (success) {
      setAuthenticatedUser(null);
    }
    history.push(Routes.FORGET_PASSWORD);
  };

  const changeEditMode = () => {
    setIsSavingData(false);
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
    setIsTouched(true);
  };

  const discardChanges = () => {
    // reset all form values (except email) and businessName
    // and return to not editing mode
    formValues.firstName = authenticatedUser!.firstName;
    formValues.lastName = authenticatedUser!.lastName;
    formValues.phoneNumber = authenticatedUser!.phoneNumber;
    if (authenticatedUser?.role !== Role.VOLUNTEER)
      setBusinessName(donor!.businessName);
    else setBusinessName("");
    setIsEditing(false);
    onClose();
    setFormErrors({
      businessName: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    setIsTouched(false);
  };

  const validateForm = () => {
    const newErrors = {
      businessName: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };

    let isValid = true;

    if (!businessName && authenticatedUser?.role !== Role.VOLUNTEER) {
      isValid = false;
      newErrors.businessName = ErrorMessages.requiredField;
    }
    if (!formValues.firstName) {
      isValid = false;
      newErrors.firstName = ErrorMessages.requiredField;
    }
    if (!formValues.lastName) {
      isValid = false;
      newErrors.lastName = ErrorMessages.requiredField;
    }
    if (!formValues.phoneNumber) {
      isValid = false;
      newErrors.phoneNumber = ErrorMessages.requiredField;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const onSubmitClick = async () => {
    if (!validateForm()) return;

    setIsSavingData(true);

    // format user request data object
    const userData = {
      id: authenticatedUser!.id,
      role: authenticatedUser!.role,
      ...formValues,
    };

    let updatedDonor = null;

    // update user values
    const updatedUser = await UserAPIClient.updateUserById(
      authenticatedUser!.id,
      {
        userData,
      },
    );

    if (authenticatedUser?.role === Role.DONOR) {
      // update donor values
      updatedDonor = await DonorAPIClient.updateDonorById(donor!.id, {
        businessName,
      });
    }

    // update authenticatedUser and local storage to reflect changes
    const user = {
      accessToken: authenticatedUser!.accessToken,
      ...updatedUser,
    };
    setAuthenticatedUser(user);

    const keys = Object.keys(user);
    const values = Object.values(user);
    for (let i = 0; i < keys.length; i += 1) {
      if (
        keys[i] === "firstName" ||
        keys[i] === "lastName" ||
        keys[i] === "phoneNumber"
      ) {
        setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, keys[i], values[i]);
      }
    }

    // handle loading spinner state
    if (updatedUser) {
      setIsSavingData(false);
    }
    setIsEditing(false);
    setIsTouched(false);
  };

  const EditInfoButton = () => {
    return !isEditing ? (
      <Button
        variant="editInfo"
        isDisabled={authenticatedUser?.role === Role.ADMIN}
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
        onClick={onOpen}
      />
    );
  };

  return (
    <Container centerContent variant="responsiveContainer">
      <EditAccountModal
        isOpen={isOpen}
        onClose={onClose}
        discardChanges={discardChanges}
      />
      <Box>
        {!isEditing ? (
          <Box mt={10}>
            <Button
              onClick={navigateToDashboard}
              paddingLeft="0"
              backgroundColor="transparent"
            >
              <ArrowBackIcon w={8} h={5} /> Back
            </Button>
          </Box>
        ) : null}

        <HStack align="flex-end">
          <Text mt="1em" textStyle="mobileHeader1">
            My account
          </Text>
          <Spacer />
          <EditInfoButton />
        </HStack>
        <Text textStyle="mobileSmall" color="hubbard.100" mt="1em" mb="2em">
          Edit any account information here.
        </Text>
        {authenticatedUser?.role === Role.DONOR ? (
          <FormControl
            isRequired
            isReadOnly={!isEditing}
            isInvalid={!!formErrors.businessName}
          >
            <Text mb="1em" textStyle="mobileBodyBold" color="hubbard.100">
              Organization
            </Text>

            <FormLabel>Name of business</FormLabel>
            <Input
              mt="2"
              value={businessName}
              name="businessName"
              placeholder="Enter name of business"
              variant={isEditing ? "customFilled" : "unstyled"}
              onChange={(e) => handleChange(e.target.value, "businessName")}
            />
            <FormErrorMessage>{formErrors.businessName}</FormErrorMessage>
          </FormControl>
        ) : null}
        <Text
          mt={{ base: "40px", md: "54px" }}
          mb="1em"
          textStyle="mobileBodyBold"
          color="hubbard.100"
        >
          {authenticatedUser?.role === Role.VOLUNTEER
            ? "Volunteer information"
            : "Point of contact"}
        </Text>
        <HStack spacing={{ base: "16px" }} alignItems="start">
          <Box>
            <FormControl
              isRequired
              isReadOnly={!isEditing}
              isInvalid={!!formErrors.firstName}
            >
              <FormLabel>First name</FormLabel>
              <Input
                mt="2"
                value={formValues!.firstName}
                name="firstName"
                placeholder="Enter first name"
                variant={isEditing ? "customFilled" : "unstyled"}
                onChange={(e) => handleChange(e.target.value, "firstName")}
              />
              <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box mt="2rem">
            <FormControl
              isRequired
              isReadOnly={!isEditing}
              isInvalid={!!formErrors.lastName}
            >
              <FormLabel>Last name</FormLabel>
              <Input
                mt="2"
                value={formValues!.lastName}
                name="lastName"
                placeholder="Enter last name"
                variant={isEditing ? "customFilled" : "unstyled"}
                onChange={(e) => handleChange(e.target.value, "lastName")}
              />
              <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
            </FormControl>
          </Box>
        </HStack>
        <Box mt={{ base: "24px", md: "40px" }}>
          <FormControl
            isRequired
            isReadOnly={!isEditing}
            isInvalid={!!formErrors.phoneNumber}
          >
            <FormLabel>Phone number</FormLabel>
            <Input
              mt="2"
              value={formValues!.phoneNumber}
              name="phoneNumber"
              placeholder="Enter phone number"
              variant={isEditing ? "customFilled" : "unstyled"}
              onChange={(e) => handleChange(e.target.value, "phoneNumber")}
            />
            <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>
          </FormControl>
        </Box>
        {!isEditing ? (
          <Box mt={{ base: "24px", md: "40px" }}>
            <FormControl isRequired isReadOnly>
              <FormLabel>Email address</FormLabel>
              <Input
                mt="2"
                value={formValues!.email}
                name="email"
                placeholder="Enter email"
                variant="unstyled"
                onChange={(e) => handleChange(e.target.value, "email")}
                color="hubbard.100"
              />
            </FormControl>
          </Box>
        ) : null}
        {isEditing ? (
          <Box mt={{ base: "66px", md: "56px" }}>
            <Button
              width="100%"
              size="lg"
              mt="2"
              variant="navigation"
              onClick={onSubmitClick}
              isDisabled={isSavingData || !isTouched}
            >
              {isSavingData ? <Spinner /> : "Save Changes"}
            </Button>
          </Box>
        ) : (
          <Box mt={{ base: "66px", md: "56px" }}>
            <Button
              width="100%"
              size="lg"
              mt="2"
              variant="navigation"
              onClick={onResetPasswordClick}
            >
              Change password
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Account;
