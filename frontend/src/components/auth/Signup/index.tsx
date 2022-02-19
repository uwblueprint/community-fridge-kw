import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import { Role } from "../../../types/AuthTypes";
import AccountDetails from "./AccountDetails";
import AccountType from "./AccountType";
import CreateAccount from "./CreateAccount";
import VerificationPage from "./VerificationEmail";

const steps = [
  { id: "account type" },
  { id: "create account" },
  { id: "account details" },
  { id: "email verification" },
];

interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

const Signup = () => {
  const [formValues, setForm] = useForm({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    role: "",
  });

  const { step, navigation }: UseStepType = useStep({ steps, initialStep: 0 });
  const { id } = step;

  switch (id) {
    case "account type":
      return (
        <AccountType
          formData={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "create account":
      return (
        <CreateAccount
          formData={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "account details":
      return (
        <AccountDetails
          formValues={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "email verification":
      return <VerificationPage formValues={formValues} />;
    default:
      return null;
  }
};

export default Signup;
