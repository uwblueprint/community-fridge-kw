import React from "react";
import { NavigationProps, Step, useForm, useStep } from "react-hooks-helper";

import ChangePassword from "./ChangePassword";
import VerificationPage from "./VerificationEmail";

export const steps = [
  { id: "forgot password" },
  { id: "verification email" },
  { id: "new password" },
  { id: "password changed success screen" },
];

export interface UseStepType {
  step: number | Step | any;
  navigation: NavigationProps | any;
}

const ForgetPassword = ({ initialStep }: { initialStep: number }) => {
  const [formValues, setForm] = useForm({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { step, navigation }: UseStepType = useStep({ steps, initialStep });
  const { id } = step;

  switch (id) {
    case "forgot password":
      return (
        <ChangePassword
          formData={formValues}
          setForm={setForm}
          navigation={navigation}
        />
      );
    case "verification email":
      return <VerificationPage formValues={formValues} />;
    default:
      return null;
  }
};

export default ForgetPassword;
