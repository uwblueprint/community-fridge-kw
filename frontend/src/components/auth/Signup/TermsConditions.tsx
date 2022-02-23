import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import * as Routes from "../../../constants/Routes";
import useViewport from "../../../hooks/useViewport";
import { AuthenticatedUser } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import FailedModal from "./FailedModal";
import { SignUpFormProps } from "./types";

const TermsConditions = ({
  formData,
  setForm,
  navigation,
}: {
  formData: SignUpFormProps;
  setForm: SetForm;
  navigation: NavigationProps;
}) => {
  const { previous, next } = navigation;
  const history = useHistory();

  const { isDesktop } = useViewport();
  const {
    role,
    firstName,
    lastName,
    email,
    phoneNumber,
    businessName,
    password,
    acceptedTerms,
  } = formData;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const errorMessages = {
    acceptedTerms: "",
  };
  const [formErrors, setFormErrors] = React.useState(errorMessages);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e.target.checked } });
    setFormErrors({
      ...formErrors,
      acceptedTerms: "",
    });
  };

  const onSignupClick = async () => {
    const newErrors = {
      acceptedTerms: "",
    };

    if (!acceptedTerms) {
      newErrors.acceptedTerms = "Please read and accept the terms of services.";
      setFormErrors(newErrors);
      return false;
    }

    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      businessName,
      role,
    );
    if (!user) {
      onOpen();
      return false;
    }
    return next();
  };

  return (
    <Container pl="42px" pr="42px" pt="0.5rem">
      <IconButton
        marginLeft="-12px"
        float="left"
        backgroundColor="transparent"
        aria-label="go back"
        onClick={previous}
      >
        <ArrowBackIcon width="24px" height="24px" />
      </IconButton>
      {!isDesktop && (
        <IconButton
          float="right"
          aria-label="close sign up"
          onClick={() => history.push(Routes.LOGIN_PAGE)}
          backgroundColor="transparent"
        >
          <CloseIcon color="black.100" />
        </IconButton>
      )}
      <HeaderLabel text="Code of Conduct" isDesktop={isDesktop} />
      <Text mt="2rem">
        Please read and accept Community Fridge KW’s terms and conditions before
        signing up for an account.
      </Text>
      <Text mt="2rem" textStyle="mobileSmall" color="hubbard.100">
        If users abuse your website or mobile app in any way, you can terminate
        their account. Your &quot;Termination&quot; clause can inform users that
        their accounts would be terminated if they abuse your service. <br />
        <br />
        If users can post content on your website or mobile app (create content
        and share it on your platform), you can remove any content they created
        if it infringes copyright. Your Terms and Conditions will inform users
        that they can only create and/or share content they own rights to. If
        users can post content on your website or mobile app (create content and
        share it on your platform), you can remove any content they created if
        it infringes copyright. Your Terms and Conditions will inform users that
        they can only create and/or share content they own rights to. CFKW
        reserves the right to something.
      </Text>

      <FormControl mt="2rem" isRequired isInvalid={!!formErrors.acceptedTerms}>
        <Checkbox
          colorScheme="raddish"
          isChecked={acceptedTerms}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "acceptedTerms");
          }}
        >
          I have read and accept the terms of service.
        </Checkbox>
        <FormErrorMessage>{formErrors.acceptedTerms}</FormErrorMessage>
        <Box mt="3rem">
          <Button
            mt="2"
            variant="navigation"
            onClick={onSignupClick}
            width="100%"
          >
            Next
          </Button>
        </Box>
      </FormControl>
      <FailedModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default TermsConditions;
