/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React from "react";

interface RadioSelectGroupProps {
  name: string;
  value: string;
  values: string[];
  label: string;
  isRequired: boolean;
  helperText?: string;
  onChange: (arg0: any) => void;
}

const RadioSelectButton = (props: any) => {
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
      bg: "strawberry.100",
      textStyle: "mobileBodyBold",
      color: "black.100",
      border: "none",
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

const RadioSelectGroup = (props: RadioSelectGroupProps) => {
  const {
    name,
    value,
    values,
    label,
    isRequired,
    helperText,
    onChange,
  } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange,
    value,
  });

  const radioSelectButtons = values.map((v) => (
    <RadioSelectButton key={v} {...getRadioProps({ value: v })}>
      {v}
    </RadioSelectButton>
  ));

  const group = getRootProps();

  return (
    <FormControl isRequired={isRequired} m="2em 0">
      <FormLabel>{label}</FormLabel>
      {helperText && <FormHelperText mb="1em">{helperText}</FormHelperText>}
      <VStack {...group}>{radioSelectButtons}</VStack>
    </FormControl>
  );
};

export default RadioSelectGroup;
