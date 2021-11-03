import React from "react";
import { useForm, useStep } from "react-hooks-helper";

import AccountDetails from "./AccountDetails";
import CreateAccount from "./CreateAccount";

const steps = [
  {
    id: "create account",
  },
  { id: "account details" },
];

interface UseStepType {
  step: any;
  navigation: any;
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
  });

  const { step, navigation }: UseStepType = useStep({ steps, initialStep: 0 });
  const { id } = step;

  switch (id) {
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
    default:
      return null;
  }
};

export default Signup;
