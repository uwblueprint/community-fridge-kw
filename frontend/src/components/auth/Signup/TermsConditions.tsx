import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  IconButton,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import authAPIClient from "../../../APIClients/AuthAPIClient";
import { SignupErrorMessage } from "../../../constants/AuthConstants";
import * as Routes from "../../../constants/Routes";
import useViewport from "../../../hooks/useViewport";
import { AuthenticatedUser, Role } from "../../../types/AuthTypes";
import HeaderLabel from "../../common/HeaderLabel";
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
    <Container pl="42px" pr="42px" pt="0.5rem">
      <IconButton
        marginLeft="-12px"
        float="left"
        backgroundColor="transparent"
        aria-label="go back"
        onClick={handlePrev}
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
      <HeaderLabel text="Code of Conduct" />
      <Text mt="2rem">
        Please read and accept Community Fridge KW’s terms and conditions before
        signing up for an account.
      </Text>
      <Text mt="2rem" textStyle="mobileSmall" color="hubbard.100">
        At the heart of Community Fridge KW are its volunteers; neighbours that
        drive all operations with care. Welcome to our community of organizers.
        CFKW volunteers maintain community fridge locations through daily
        check-ins; deliver food to community members in need; rescue food from
        local businesses and farms for the fridge; support in outreach and
        marketing and much more. Before you get started, we ask that you review
        our statements of shared principles and values to ensure you feel the
        same way.
        <UnorderedList>
          <ListItem>
            As volunteers of a mutual aid, grassroots effort such as Community
            Fridge KW, we position ourselves in the community as facilitators,
            connectors and allies. We do not uphold or practice a hierarchy,
            power indifferences or claim to know what’s best for any person.
          </ListItem>
          <ListItem>
            We recognize the vulnerability of those we seek to serve and we
            strive to offer a source of fresh, free food without judgement,
            surveillance, data collection, confrontation, or question.
          </ListItem>
          <ListItem>
            The relationships we build and participate in within our community
            are the lifelines of our work. As volunteers, we have the privilege
            of cultivating and growing these relationships — a privilege we
            don’t hold lightly. We strive to treat donors, supporters and hosts
            with just as much respect, dignity, and agency as the neighbours we
            seek to serve.
          </ListItem>
          <ListItem>
            We consider ourselves stewards to the community fridge and its sites
            of service. As stewards, we are eager to maintain compliance with
            the expectations of both public health and our generous hosts.
          </ListItem>
          <ListItem>
            The work we do is disruptive to traditional resource distribution
            approaches and often challenges our own personal beliefs and values.
            We hold space to grapple with this internal conflict for ourselves
            and each other, so that we may participate in and facilitate
            processes of unlearning around how we perceive “giving”, “taking”
            and “sharing”.
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
