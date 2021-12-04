import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import xl from "../../../assets/donation-sizes/lg.png";
import lg from "../../../assets/donation-sizes/md.png";
import md from "../../../assets/donation-sizes/sm.png";
import sm from "../../../assets/donation-sizes/xs.png";
import * as Routes from "../../../constants/Routes";
import customTheme from "../../../theme";
import RadioImageSelectGroup from "../../common/RadioImageSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import { DonationSizeInterface, SchedulingStepProps } from "./types";

const DonationInformation: any = ({
  formValues,
  setForm,
  navigation,
  isBeingEdited,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { id, categories, size } = formValues;
  const history = useHistory();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setForm({ target: { name, value: e } });
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
  };

  const onSaveClick = async () => {
    await SchedulingAPIClient.updateSchedule(id, formValues);
    history.push(Routes.DASHBOARD_PAGE);
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

  return (
    <Container p="30px">
      <SchedulingProgressBar activeStep={1} totalSteps={4} />
      <Text textStyle="mobileHeader2" mt="2em">
        Donation Information
      </Text>
      <RadioImageSelectGroup
        value={size}
        values={DonationSizes}
        name="size"
        isRequired
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleChange(e, "size");
        }}
      />

      <FormControl isRequired my="50px">
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
      </FormControl>

      {isBeingEdited ? (
        <VStack>
          <Button onClick={onSaveClick} variant="navigation" w="100%">
            Save Changes
          </Button>
          <Button
            onClick={() => history.push(Routes.DASHBOARD_PAGE)}
            variant="cancelNavigation"
            w="100%"
          >
            Cancel
          </Button>
        </VStack>
      ) : (
        <HStack>
          <Button onClick={previous} variant="navigation">
            Back
          </Button>
          <Button onClick={next} variant="navigation">
            Next
          </Button>
        </HStack>
      )}
    </Container>
  );
};

export default DonationInformation;
