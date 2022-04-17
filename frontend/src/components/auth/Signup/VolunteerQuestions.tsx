import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { NavigationProps, SetForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import useViewport from "../../../hooks/useViewport";
import HeaderLabel from "../../common/HeaderLabel";
import MandatoryInputDescription from "./components/MandatoryInputDescription";
import { SignUpFormProps } from "./types";

const VolunteerQuestions = ({
  formData,
  setForm,
  navigation,
}: {
  navigation: NavigationProps;
  formData: SignUpFormProps;
  setForm: SetForm;
}) => {
  const { previous, next } = navigation;
  const history = useHistory();
  const {
    cityQuestionResponse,
    intentionQuestionResponse,
    skillsQuestionResponse,
  } = formData;

  const { isDesktop } = useViewport();

  const errorMessages = {
    cityQuestion: "",
    intentionsQuestion: "",
    skillsQuestion: "",
  };
  const [formErrors, setFormErrors] = useState(errorMessages);

  const validateForm = () => {
    const newErrors = {
      cityQuestion: "",
      intentionsQuestion: "",
      skillsQuestion: "",
    };
    let valid = true;

    if (!cityQuestionResponse.trim()) {
      valid = false;
      newErrors.cityQuestion = "Please enter the city you currently live in.";
    }
    if (!intentionQuestionResponse.trim()) {
      valid = false;
      newErrors.intentionsQuestion = "Please enter why you want to join us.";
    }
    if (!skillsQuestionResponse.trim()) {
      valid = false;
      newErrors.skillsQuestion =
        "Please enter skills or traits you would like to share or develop as a volunteer.";
    }
    setFormErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  return (
    <Container pl="42px" pr="42px" pt={["2.75rem", "4rem"]}>
      <Button
        leftIcon={<ArrowBackIcon width="24px" height="24px" />}
        variant="back"
        onClick={previous}
      >
        Back
      </Button>
      <HeaderLabel text="Volunteer information" />
      <FormControl mt="2rem" isRequired>
        <Box>
          <MandatoryInputDescription label="What city do you currently live in?" />
          <FormControl isRequired isInvalid={!!formErrors.cityQuestion}>
            <Input
              validate="Required"
              mt="2"
              value={cityQuestionResponse}
              onChange={setForm}
              name="cityQuestionResponse"
              placeholder="Enter location"
            />
            <FormErrorMessage>{formErrors.cityQuestion}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1.5rem">
          <MandatoryInputDescription label="Why do you want to join us?" />
          <FormControl isRequired isInvalid={!!formErrors.intentionsQuestion}>
            <Textarea
              validate="Required"
              mt="2"
              value={intentionQuestionResponse}
              onChange={setForm}
              name="intentionQuestionResponse"
              placeholder="Type answer here"
            />
            <FormErrorMessage>{formErrors.intentionsQuestion}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="1.5rem">
          <MandatoryInputDescription label="What skills/traits would you like to share and/or develop as a volunteer with CFKW?" />
          <FormControl isRequired isInvalid={!!formErrors.skillsQuestion}>
            <Textarea
              validate="Required"
              mt="2"
              value={skillsQuestionResponse}
              onChange={setForm}
              name="skillsQuestionResponse"
              placeholder="Type answer here"
            />
            <FormErrorMessage>{formErrors.skillsQuestion}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box mt="2.5rem">
          <Button mt="2" variant="navigation" onClick={handleNext} width="100%">
            Next
          </Button>
        </Box>
      </FormControl>
    </Container>
  );
};

export default VolunteerQuestions;
