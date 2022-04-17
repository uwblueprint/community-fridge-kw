import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, FormControl, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { Redirect, useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import { SignUpFormProps } from "./types";

const AccountType = ({
  formData,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formData: SignUpFormProps;
  setForm: SetForm;
}) => {
  const { next } = navigation;

  const history = useHistory();
  const { role } = formData;
  const { authenticatedUser } = useContext(AuthContext);

  const errorMessages = {
    role: "",
  };
  const [formErrors, setFormErrors] = React.useState(errorMessages);
  const roleValues = [Role.DONOR, Role.VOLUNTEER];

  const handleChange = (e: string, name: string) => {
    setForm({ target: { name, value: e } });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {
      role: "",
    };
    let valid = true;

    if (!role) {
      valid = false;
      newErrors.role = "This is a required field.";
    }
    setFormErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  if (authenticatedUser) {
    return <Redirect to={Routes.DASHBOARD_PAGE} />;
  }
  return (
    <Container pl="42px" pr="42px" pt={["2.75rem", "4rem"]}>
      <Button
        leftIcon={<ArrowBackIcon width="24px" height="24px" />}
        variant="back"
        onClick={() => history.push(Routes.LOGIN_PAGE)}
      >
        Back
      </Button>
      <HeaderLabel text="Create an account" />
      <Text mt="1rem" textStyle="mobileSmall" color="hubbard.100">
        Thank you for your interest in helping out Community Fridge KW!
      </Text>

      <FormControl mt="2rem" isRequired>
        <Text
          mt="2rem"
          mb="1.5rem"
          textStyle="mobileBodyBold"
          color="hubbard.100"
        >
          Account type
        </Text>
        <RadioSelectGroup
          name="role"
          value={role}
          values={roleValues}
          icons={[]}
          isRequired
          error={formErrors.role}
          onChange={(e: string) => {
            handleChange(e, "role");
          }}
          horizontalOnly
        />
        <Button
          mt="3rem"
          variant="navigation"
          onClick={handleNext}
          width="100%"
        >
          Next
        </Button>
      </FormControl>
    </Container>
  );
};

export default AccountType;
