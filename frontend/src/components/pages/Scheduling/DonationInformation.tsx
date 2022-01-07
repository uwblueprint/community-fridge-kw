import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import xl from "../../../assets/donation-sizes/lg.png";
import lg from "../../../assets/donation-sizes/md.png";
import md from "../../../assets/donation-sizes/sm.png";
import sm from "../../../assets/donation-sizes/xs.png";
import customTheme from "../../../theme";
import RadioImageSelectGroup from "../../common/RadioImageSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import ErrorMessages from "./ErrorMessages";
import { DonationSizeInterface, SchedulingStepProps } from "./types";

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

  const DonationSizes: DonationSizeInterface[] = [
    {
      image: sm,
      size: "Small",
      description: "Fills less than a shelf of the fridge/pantry",
    },
    {
      image: md,
      size: "Medium",
      description: "Approximately fills one shelf of the fridge/pantry",
    },
    {
      image: lg,
      size: "Large",
      description: "Approximately fills two shelves of the fridge/pantry",
    },
    {
      image: xl,
      size: "Extra-large",
      description:
        "Approximately fills four shelves of the fridge/ pantry (full capacity)",
    },
  ];

  const categoriesOptions = [
    "Dry packaged goods",
    "Non-perishables",
    "Fresh produce",
    "Bread and baked goods",
    "Oil, spreads, and seasoning",
    "Tea and coffee",
    "Frozen meals",
    "Prepared meals",
    "Non-alcoholic drinks and juices",
    "Essential items (masks, hand sanitizer, bags)",
    "Hygiene products (tampons, pads, soap, etc.)",
  ];

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

  return (
    <Container variant="responsiveContainer">
      <SchedulingProgressBar activeStep={1} totalSteps={4} />
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

      <FormControl isRequired isInvalid={!!formErrors.categories} my="50px">
        <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
          Type of item(s)
        </FormLabel>
        <Stack spacing={2} direction="column" size="lg" mt="10px">
          {categoriesOptions.map((item, i) => (
            <Checkbox
              key={i}
              colorScheme="black"
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

      {isBeingEdited ? (
        <VStack alignItems="flex-start">
          <Button
            onClick={onSaveClick}
            variant="navigation"
            w={{ base: "100%", md: "350px" }}
          >
            Save Changes
          </Button>
          <Button
            onClick={() => go && go("confirm donation details")}
            variant="cancelNavigation"
            w={{ base: "100%", md: "350px" }}
          >
            Cancel
          </Button>
        </VStack>
      ) : (
        <HStack>
          <Button
            onClick={previous}
            variant="navigation"
            width={{ base: "100%", md: "20%" }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="navigation"
            width={{ base: "100%", md: "20%" }}
          >
            Next
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default DonationInformation;
