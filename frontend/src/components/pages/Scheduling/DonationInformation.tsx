import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { prependOnceListener } from "process";
import React from "react";

import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import {
  DonationSizeInterface,
  SchedulingStepProps,
  TypesOfItemsInterface,
} from "./types";

const DonationSizes: DonationSizeInterface[] = [
  {
    image: "image1",
    size: "Extra small",
    description: "Fills less than a shelf of the fridge/pantry",
  },
  {
    image: "image2",
    size: "Small",
    description: "Approximately fills one shelf of the fridge/ pantry",
  },
  {
    image: "image3",
    size: "Medium",
    description: "Approximately fills two shelves of the fridge/ pantry",
  },
  {
    image: "image4",
    size: "Large",
    description:
      "Approximately fills four shelves of the fridge/ pantry (full capacity)",
  },
];

const DonationSizeCard = ({
  image,
  size,
  description,
}: DonationSizeInterface): any => {
  return (
    <>
      <Box borderRadius="lg" borderWidth="1px" my="10px">
        <HStack>
          <Box
            m="20px"
            w="5rem"
            h="5rem"
            backgroundColor="gray.100"
            borderRadius="lg"
          >
            {image}
          </Box>
          <Box>
            <Text textStyle="mobileBodyBold"> {size}</Text>
            <Text textStyle="mobileSmall">{description}</Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

const TypesOfItems = ({ title, list }: TypesOfItemsInterface) => {
  return (
    <Box my="40px">
      <Text textStyle="mobileHeader4">{title}</Text>

      <Stack spacing={2} direction="column" size="lg" mt="10px">
        {list.map((item, i) => (
          <Checkbox key={i}>{item}</Checkbox>
        ))}
      </Stack>
    </Box>
  );
};

const DonationInformation: any = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { categories, size } = formValues;
  //   const { insert form fields for this page here } = formData;

  return (
    // Insert Select Date and Time page here
    <Container pl="42px" pr="42px" py="73px">
      <SchedulingProgressBar activeStep={1} totalSteps={4} />
      <Text textStyle="mobileHeader2" mb="20px">
        Donation Information{" "}
      </Text>
      <Text textStyle="mobileHeader4">Size/quantity of donation </Text>
      <Box>
        {DonationSizes.map((donationSize, i) => (
          <DonationSizeCard
            key={i}
            image={donationSize.image}
            size={donationSize.size}
            description={donationSize.description}
          />
        ))}
      </Box>
      <TypesOfItems title="Types of item(s)" list={categories} />

      <HStack>
        <Button onClick={previous} variant="navigation">
          Back
        </Button>
        <Button onClick={next} variant="navigation">
          Next
        </Button>
      </HStack>
    </Container>
  );
};

export default DonationInformation;
