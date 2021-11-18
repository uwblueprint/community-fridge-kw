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

export const EllipsisIcon = (): JSX.Element => (
  <Icon>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
        stroke="#C31887"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
        stroke="#C31887"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
        stroke="#C31887"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);
