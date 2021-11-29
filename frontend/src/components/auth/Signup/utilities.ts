import { SignUpFormProps } from "./types";

const validate = (values: SignUpFormProps) => {
  const errors: any = {};
  if (!values.firstName) {
    errors.firstName = "Required";
  }
  if (!values.lastName) {
    errors.lastName = "Required";
  }
  if (values.businessName) {
    errors.employed = "We're only accepted unemployed applicants at the moment";
  }

  return errors;
};

export default validate;
