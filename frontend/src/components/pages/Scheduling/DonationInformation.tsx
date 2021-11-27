import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { env, prependOnceListener } from "process";
import React from "react";

import xl from "../../../assets/donation-sizes/lg.png";
import lg from "../../../assets/donation-sizes/md.png";
import md from "../../../assets/donation-sizes/sm.png";
import sm from "../../../assets/donation-sizes/xs.png";
import customTheme from "../../../theme";
import RadioImageSelectGroup from "../../common/RadioImageSelectGroup";
import RadioSelectGroup from "../../common/RadioSelectGroup";
import SchedulingProgressBar from "../../common/SchedulingProgressBar";
import {
  DonationSizeInterface,
  SchedulingStepProps,
  TypesOfItemsInterface,
} from "./types";

const DonationSizes: DonationSizeInterface[] = [
  {
    image: sm,
    size: "Small",
    description: "Approximately fills one shelf of the fridge/ pantry",
  },
  {
    image: md,
    size: "Medium",
    description: "Approximately fills two shelves of the fridge/ pantry",
  },
  {
    image: lg,
    size: "Large",
    description:
      "Approximately fills four shelves of the fridge/ pantry (full capacity)",
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

// const TypesOfItems = ({ title, list, setForm }: TypesOfItemsInterface) => {
//   return (
//     <FormControl isRequired my="50px">
//       <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
//         {title}
//       </FormLabel>
//       <Stack spacing={2} direction="column" size="lg" mt="10px">
//         {list.map((item, i) => (
//           <Checkbox
//             key={i}
//             colorScheme="black"
//             onChange={() => {
//               setForm({ target: { name, value: e } });
//             }}
//           >
//             {item}
//           </Checkbox>
//         ))}
//       </Stack>
//     </FormControl>
//   );
// };

const DonationInformation: any = ({
  formValues,
  setForm,
  navigation,
}: SchedulingStepProps) => {
  const { previous, next } = navigation;
  const { categories, size } = formValues;

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
    let categoriesNew = categories;
    if (e.target.checked) {
      categoriesNew.push(item);
    } else {
      categoriesNew = categories.filter((string) => item !== string);
    }

    setForm({
      target: {
        name: "categories",
        value: categoriesNew,
      },
    });
  };

  return (
    <>
      <SchedulingProgressBar activeStep={1} totalSteps={4} />
      <Container px="32px">
        <Text textStyle="mobileHeader2" mb="20px">
          Donation Information{" "}
        </Text>
        <RadioImageSelectGroup
          value={size}
          values={DonationSizes}
          name="size"
          isRequired
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e, "size");
          }}
        />

        <FormControl isRequired my="50px">
          <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
            test
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

        <HStack>
          <Button onClick={previous} variant="navigation">
            Back
          </Button>
          <Button onClick={next} variant="navigation">
            Next
          </Button>
        </HStack>
      </Container>
    </>
  );
};

export default DonationInformation;
