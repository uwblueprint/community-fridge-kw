/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Text,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import customTheme from "../../theme";
import { DonationSizeInterface } from "../pages/Scheduling/types";

interface RadioImageSelectGroupProps {
  value: string;
  values: DonationSizeInterface[];
  name: string;
  isRequired?: boolean;
  onChange: (arg0: any) => void;
}

const RadioImageSelectButton = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { children } = props;

  const RadioButtonStyle = {
    default: {
      cursor: "pointer",
      borderWidth: "1px",
      borderRadius: "6",
      borderColor: "hubbard.100",
      boxShadow: "md",
      padding: "12px",
      color: "hubbard.100",
      shadow: "none",
    },
    selected: {
      bg: "cottonCandy.100",
      borderColor: "champagne.100",
      textStyle: "mobileBodyBold",
      color: "black.100",
    },
  };

  return (
    <Box w="100%" as="label">
      <input {...input} />
      <Box
        {...checkbox}
        {...RadioButtonStyle.default}
        _checked={RadioButtonStyle.selected}
      >
        {children}
      </Box>
    </Box>
  );
};

const RadioImageSelectGroup = (props: RadioImageSelectGroupProps) => {
  const { value, name, values, isRequired, onChange } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange,
    value,
    name,
  });

  const radioImageSelectButtons = values.map((v) => (
    <RadioImageSelectButton key={v.size} {...getRadioProps({ value: v.size })}>
      <HStack>
        <Box height="100px" width="100px">
          <Image
            objectFit="fill"
            src={v.image}
            alt="Size image"
            display="inline"
          />
        </Box>
        <Box width="70%">
          <Text textStyle="mobileBody"> {v.size}</Text>
          <Text textStyle="mobileSmall">{v.description}</Text>
        </Box>
      </HStack>
    </RadioImageSelectButton>
  ));

  const group = getRootProps();

  return (
    <FormControl isRequired={isRequired} m="2em 0">
      <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
        Size/quantity of donation
      </FormLabel>
      <VStack {...group}>{radioImageSelectButtons}</VStack>
    </FormControl>
  );
};

export default RadioImageSelectGroup;
