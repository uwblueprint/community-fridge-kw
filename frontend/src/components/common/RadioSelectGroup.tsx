/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Img,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import personIcon from "../../assets/personIcon.svg";

interface RadioSelectGroupProps {
  name: string;
  value: string;
  values: string[];
  label: string;
  helperText?: string;
  icons: number[];
  isRequired: boolean;
  helperText?: string;
  onChange: (arg0: any) => void;
}

const RadioSelectButton = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { numIcons, children } = props;

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

  const iconRender = [];
  for (let i = 0; i < numIcons; i += 1) {
    iconRender.push(
      <Img
        key={i}
        src={personIcon}
        alt="person icon"
        width="15.75px"
        align="right"
        marginTop="3px"
        marginLeft="3px"
      />,
    );
  }

  return (
    <Box w="100%" as="label">
      <input {...input} />
      <Box
        {...checkbox}
        {...RadioButtonStyle.default}
        _checked={RadioButtonStyle.selected}
      >
        {children}
        {iconRender}
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
    helperText,
    icons,
    isRequired,
    onChange,
  } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange,
    value,
  });

  const radioSelectButtons = values.map((v, i) => (
    <RadioSelectButton
      key={v}
      {...getRadioProps({ value: v })}
      numIcons={icons[i]}
    >
      {v}
    </RadioSelectButton>
  ));

  const group = getRootProps();

  return (
    <FormControl isRequired={isRequired} m="2em 0">
      <FormLabel fontWeight="600">{label}</FormLabel>
      <FormHelperText fontSize="16px" color="black.100" mb="20px">
        {helperText}
      </FormHelperText>
      {name === "timeRanges" && (
        <FormHelperText fontSize="14px" color="black.100" mb="20px">
          Each{" "}
          <Img
            src={personIcon}
            alt="person icon"
            width="15.75px"
            display="inline"
          />{" "}
          represents an already signed up donor. Please try to choose a time
          slot without a pre-existing donor.
        </FormHelperText>
      )}
      <VStack {...group}>{radioSelectButtons}</VStack>
    </FormControl>
  );
};

export default RadioSelectGroup;
