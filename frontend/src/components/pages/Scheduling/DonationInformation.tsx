import {
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import customTheme from "../../../theme";
import RadioImageSelectGroup from "../../common/RadioImageSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import BackButton from "./BackButton";
import CancelButton from "./CancelEditsButton";
import ErrorMessages from "./ErrorMessages";
import NextButton from "./NextButton";
import SaveButton from "./SaveChangesButton";
import { categoriesOptions, DonationSizes, SchedulingStepProps } from "./types";

const DonationInformation: any = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next, go } = navigation;
  const { id, categories, size } = formValues;
  const [formErrors, setFormErrors] = useState({
    categories: "",
    size: "",
  });

  const getSubmitState = () => {
    return !!formValues.size && !!formValues.categories.length;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
    setFormErrors({
      ...formErrors,
      size: "",
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: string,
  ) => {
    setForm({
      target: {
        name: "categories",
        value: e.target.checked
          ? [...categories, item]
          : categories.filter((string) => item !== string),
      },
    });
    setFormErrors({
      ...formErrors,
      categories: "",
    });
  };

  const validateForm = () => {
    const newErrors = {
      categories: "",
      size: "",
    };
    let valid = true;

    if (!categories || categories.length === 0) {
      valid = false;
      newErrors.categories = ErrorMessages.requiredField;
    }
    if (!size) {
      valid = false;
      newErrors.size = ErrorMessages.requiredField;
    }
    setFormErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (validateForm()) {
      next();
    }
  };

  const onSaveClick = async () => {
    if (!validateForm()) {
      return;
    }
    await SchedulingAPIClient.updateSchedule(id, formValues);
    if (go !== undefined) {
      go("confirm donation details");
    }
  };

  const discardChanges = async () => {
    const scheduleResponse = await SchedulingAPIClient.getScheduleById(id);
    setForm({
      target: { name: "categories", value: scheduleResponse.categories },
    });
    setForm({ target: { name: "size", value: scheduleResponse.size } });
    return go && go("confirm donation details");
  };

  return (
    <Container variant="responsiveContainer">
      {isBeingEdited ? (
        <CancelButton discardChanges={discardChanges} />
      ) : (
        <>
          <SchedulingProgressBar activeStep={1} totalSteps={4} />
          <BackButton previous={previous} />
        </>
      )}
      <Text textStyle="mobileHeader2" mt="2em">
        Donation Information
      </Text>
      <RadioImageSelectGroup
        value={size}
        values={DonationSizes}
        name="size"
        isRequired
        error={formErrors.size}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleChange(e, "size");
        }}
      />

      {!!formValues.size && (
        <FormControl isRequired isInvalid={!!formErrors.categories} my="50px">
          <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
            Type of item(s)
          </FormLabel>
          <Stack spacing={2} direction="column" size="lg" mt="10px">
            {categoriesOptions.map((item, i) => (
              <Checkbox
                key={i}
                colorScheme="raddish"
                isChecked={categories.includes(item)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleCheckboxChange(e, item);
                }}
              >
                {item}
              </Checkbox>
            ))}
          </Stack>
          <FormErrorMessage>{formErrors.categories}</FormErrorMessage>
        </FormControl>
      )}
      {isBeingEdited ? (
        <SaveButton onSaveClick={onSaveClick} />
      ) : (
        <NextButton canSubmit={getSubmitState()} handleNext={handleNext} />
      )}
    </Container>
  );
};

export default DonationInformation;
