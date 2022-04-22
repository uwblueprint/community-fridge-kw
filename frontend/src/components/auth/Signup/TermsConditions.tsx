import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import { SignupErrorMessage } from "../../../constants/AuthConstants";
import { AuthenticatedUser, Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
import BackButton from "../../pages/Scheduling/BackButton";
import SignUpFailedModal from "./ReturnToLoginModal";
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
  const { go, next } = navigation;

  const {
    role,
    firstName,
    lastName,
    email,
    phoneNumber,
    businessName,
    password,
    acceptedTerms,
    cityQuestionResponse,
    intentionQuestionResponse,
    skillsQuestionResponse,
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
      cityQuestionResponse,
      intentionQuestionResponse,
      skillsQuestionResponse,
    );
    if (!user) {
      onOpen();
      return false;
    }
    return next();
  };

  const handlePrev = () => {
    if (go) {
      if (role === Role.DONOR) {
        go("account type");
      } else {
        go("volunteer questions");
      }
    }
  };

  return (
    <Container pl="42px" pr="42px" pt={["2.75rem", "4rem"]}>
      <BackButton previous={handlePrev} />
      <HeaderLabel text="Statement of Values & Principles" />
      <Text mt="1.5rem">
        Please read and accept Community Fridge KW’s terms and conditions before
        signing up for an account.
      </Text>
      <Text mt="2rem" textStyle="mobileSmall" color="hubbard.100">
        At the heart of Community Fridge KW are its volunteers. CFKW volunteers
        maintain community fridge locations through daily check-ins; deliver
        food to community members in need; rescue food from local businesses and
        farms for the fridge; support in outreach and marketing and much more.
        <br />
        <br />
        <Box as="span" fontStyle="italic" fontWeight="700">
          Before you get started, we ask that you review our statements of
          shared principles and values to ensure you feel the same way.
        </Box>
        <br />
        <br />
        <UnorderedList>
          <ListItem>
            As volunteers of a mutual aid, grassroots effort, we position
            ourselves in the community as facilitators, connectors, and allies.
            We do not uphold or practice a hierarchy, power indifferences, or
            claim to know what’s best for any person.
          </ListItem>
          <ListItem>
            We recognize the vulnerability of those we seek to serve and we
            strive to offer a source of fresh free food without judgement,
            surveillance, data collection, confrontation, or question.
          </ListItem>
          <ListItem>
            The relationships we build and participate in with our community are
            the lifelines of our work. As volunteers, we have the privilege of
            cultivating and growing these relationships. We strive to treat
            donors, supporters and hosts with just as much respect, dignity, and
            agency as the neighbours we seek to serve.
          </ListItem>
          <ListItem>
            We consider ourselves stewards to the community fridge and its sites
            of service. Thus, we are eager to maintain compliance with the
            expectations of both public health and our generous hosts.
          </ListItem>
          <ListItem>
            The work we do is disruptive to traditional resource distribution
            approaches and often challenges our own personal beliefs and values.
            We hold space to grapple with this internal conflict so that we may
            participate in, and facilitate unlearning around how we perceive
            “giving”, “taking” and “sharing”.
          </ListItem>
        </UnorderedList>
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
      <SignUpFailedModal
        errorHeader={SignupErrorMessage.HEADER}
        errorMessage={SignupErrorMessage.BODY}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Container>
  );
};

export default TermsConditions;
