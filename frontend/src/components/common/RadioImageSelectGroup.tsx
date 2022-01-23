/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  HStack,
  Image,
  Radio,
  Text,
  useRadio,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import useViewport from "../../hooks/useViewport";
import customTheme from "../../theme";
import { DonationSizeInterface } from "../pages/Scheduling/types";

interface RadioImageSelectGroupProps {
  value: string;
  values: DonationSizeInterface[];
  name: string;
  isRequired?: boolean;
  error?: string;
  onChange: (arg0: any) => void;
}

const RadioImageSelectButton = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { invalid, children } = props;

  const RadioButtonStyle = {
    default: {
      cursor: "pointer",
      borderWidth: "1px",
      borderRadius: "6",
      borderColor: "mold.100",
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
    invalid: {
      color: "tomato.100",
      borderColor: "tomato.100",
    },
  };

  return (
    <Box w="100%" as="label">
      <input {...input} />
      {invalid ? (
        <Box
          h="100%"
          {...checkbox}
          {...RadioButtonStyle.default}
          _checked={RadioButtonStyle.selected}
          {...RadioButtonStyle.invalid}
        >
          {children}
        </Box>
      ) : (
        <Box
          h="100%"
          {...checkbox}
          {...RadioButtonStyle.default}
          _checked={RadioButtonStyle.selected}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

const RadioImageSelectGroup = (props: RadioImageSelectGroupProps) => {
  const { value, name, values, isRequired, error, onChange } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange,
    value,
    name,
  });

  const { isDesktop } = useViewport();

  const radioImageSelectButtons = values.map((v) => (
    <RadioImageSelectButton
      key={v.size}
      invalid={!!error}
      {...getRadioProps({ value: v.size })}
    >
      {isDesktop ? (
        <VStack p="20px">
          <Flex alignItems="flex-start">
            <Radio
              isChecked={v.size === value}
              mx="10px"
              colorScheme="raddish"
              size="md"
              mt="8px"
            />
            <Text textStyle="mobileBody">{v.size}</Text>
          </Flex>
          <Image
            objectFit="fill"
            src={v.image}
            alt="Size image"
            display="inline"
            h="164px"
            w="164px"
          />
          <Text textStyle="mobileSmall">{v.description}</Text>
        </VStack>
      ) : (
        <HStack alignItems="flex-start">
          <Radio
            isChecked={v.size === value}
            mx="10px"
            colorScheme="raddish"
            size="md"
            mt="8px"
          />
          <Box width="70%">
            <Text textStyle="mobileBody"> {v.size}</Text>
            <Text textStyle="mobileSmall">{v.description}</Text>
          </Box>
          <Box height="100px" width="100px">
            <Image
              objectFit="fill"
              src={v.image}
              alt="Size image"
              display="inline"
            />
          </Box>
        </HStack>
      )}
    </RadioImageSelectButton>
  ));

  const group = getRootProps();

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error} m="2em 0">
      <FormLabel fontSize={customTheme.textStyles.mobileHeader4.fontSize}>
        Size/quantity of donation
      </FormLabel>
      <Grid
        templateRows={{
          base: "repeat(4, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(1, 1fr)",
        }}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 4fr)",
        }}
        rowGap={4}
        columnGap={6}
        {...group}
      >
        {radioImageSelectButtons}
      </Grid>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default RadioImageSelectGroup;
