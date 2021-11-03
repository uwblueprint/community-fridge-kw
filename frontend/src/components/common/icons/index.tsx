import { Icon } from "@chakra-ui/react";
import React from "react";

/* eslint-disable import/prefer-default-export */
export const MenuIcon = (): JSX.Element => (
  <Icon viewBox="0 0 24 24">
    <path d="M3 12H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 6H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 18H21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

interface CloseIconProps {
  color: string;
}
export const CloseIcon = ({ color }: CloseIconProps): JSX.Element => (
  <Icon viewBox="0 0 24 24">
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

export const BackArrow = (): JSX.Element => (
  <Icon viewBox="0 0 24 24">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.4375 18.75L4.6875 12L11.4375 5.25"
        stroke="black"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        strokeLinejoin="round"
        d="M5.625 12H19.3125"
        stroke="black"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  </Icon>
);

export const CheckmarkIcon = (): JSX.Element => (
  <Icon viewBox="0 0 9 9">
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 2.25L3.375 6.375L1.5 4.5"
        stroke="#48BB78"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);
