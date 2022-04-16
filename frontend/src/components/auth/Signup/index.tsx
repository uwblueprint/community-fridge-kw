import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import { Role } from "../../../types/AuthTypes";
import AccountDetails from "./AccountDetails";
import AccountType from "./AccountType";
import CreateAccount from "./CreateAccount";
import TermsConditions from "./TermsConditions";
import VerificationPage from "./VerificationEmail";
import VolunteerQuestions from "./VolunteerQuestions";

const steps = [
  { id: "account type" },
  { id: "create account" },
  { id: "account details" },
  { id: "volunteer questions" },
  { id: "terms conditions" },
  { id: "email verification" },
];

interface UseStepType {
  step: number | Step | any;
  index: number;
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
    acceptedTerms: false,
    cityQuestionResponse: "",
    intentionQuestionResponse: "",
    skillsQuestionResponse: "",
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
    case "volunteer questions":
      if (formValues.role === Role.DONOR) {
        navigation.next();
      }
      return (
        <VolunteerQuestions
          formData={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "terms conditions":
      return (
        <TermsConditions
          formData={formValues}
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
