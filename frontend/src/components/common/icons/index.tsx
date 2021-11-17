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

export const Facebook = (): JSX.Element => (
  <Icon boxSize={8} viewBox="0 0 24 24">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.3413 1.49902H2.65971C2.3523 
    1.49915 2.05752 1.62132 1.84015 
    1.83869C1.62278 2.05606 1.50061 
    2.35084 1.50049 2.65824V21.3398C1.50061 
    21.6472 1.62278 21.942 1.84015 
    22.1593C2.05752 22.3767 2.3523 22.4989 
    2.65971 22.499H12.0005V14.249H9.49033V11.249H12.0005V8.85839C12.0005 
    6.14621 13.8816 4.66965 16.3045 4.66965C17.4638 
    4.66965 18.7106 4.75683 19.0003 4.79527V7.62793H17.07C15.7519 
    7.62793 15.5006 8.25136 15.5006 9.17011V11.249H18.6413L18.2311 
    14.249H15.5006V22.499H21.3413C21.6487 22.4989 21.9434 
    22.3767 22.1608 22.1593C22.3782 21.942 22.5004 21.6472 
    22.5005 21.3398V2.65824C22.5004 2.35084 22.3782 2.05606 
    22.1608 1.83869C21.9434 1.62132 21.6487 1.49915 21.3413 1.49902Z"
        fill="#0D0D0D"
      />
    </svg>
  </Icon>
);

export const Instagram = (): JSX.Element => (
  <Icon boxSize={8} viewBox="0 0 24 24">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.3748 3.24984C17.5342 3.25331 18.645 3.71539 
        19.4648 4.53517C20.2846 5.35495 20.7467 6.46581 
        20.7501 7.62515V16.3748C20.7467 17.5342 20.2846 
        18.645 19.4648 19.4648C18.645 20.2846 17.5342 20.7467 
        16.3748 20.7501H7.62515C6.46581 20.7467 5.35495 20.2846 
        4.53517 19.4648C3.71539 18.645 3.25331 17.5342 3.24984 
        16.3748V7.62515C3.25331 6.46581 3.71539 5.35495 4.53517 
        4.53517C5.35495 3.71539 6.46581 3.25331 7.62515 
        3.24984H16.3748ZM16.3748 1.5H7.62515C4.25625 1.5 1.5 
        4.25625 1.5 7.62515V16.3748C1.5 19.7437 4.25625 22.5 
        7.62515 22.5H16.3748C19.7437 22.5 22.5 19.7437 22.5 
        16.3748V7.62515C22.5 4.25625 19.7437 1.5 16.3748 1.5Z"
        fill="#0D0D0D"
      />
      <path
        d="M17.6875 7.625C17.4279 7.625 17.1742 7.54802 16.9583 
        7.4038C16.7425 7.25958 16.5742 7.0546 16.4749 
        6.81477C16.3756 6.57494 16.3496 6.31104 16.4002 
        6.05644C16.4509 5.80184 16.5759 5.56798 16.7594 
        5.38442C16.943 5.20087 17.1768 5.07586 17.4314 
        5.02522C17.686 4.97458 17.9499 5.00057 18.1898 
        5.09991C18.4296 5.19925 18.6346 5.36747 18.7788 
        5.58331C18.923 5.79915 19 6.05291 19 6.3125C19.0004 
        6.48496 18.9667 6.6558 18.9008 6.81521C18.835 6.97462 
        18.7384 7.11945 18.6164 7.2414C18.4945 7.36335 18.3496 
        7.46002 18.1902 7.52585C18.0308 7.59167 17.86 7.62537 
        17.6875 7.625Z"
        fill="#0D0D0D"
      />
      <path
        d="M12 8.49887C12.6923 8.49887 13.369 8.70415 
        13.9446 9.08875C14.5202 9.47335 14.9688 10.02 
        15.2337 10.6596C15.4986 11.2991 15.568 12.0029 
        15.4329 12.6819C15.2978 13.3608 14.9645 13.9845 
        14.475 14.474C13.9855 14.9635 13.3618 15.2969 
        12.6828 15.4319C12.0039 15.567 11.3001 15.4977 
        10.6605 15.2327C10.021 14.9678 9.47433 14.5192 
        9.08973 13.9436C8.70513 13.368 8.49985 12.6913 
        8.49985 11.999C8.50084 11.071 8.86992 10.1813 
        9.52611 9.52513C10.1823 8.86894 11.072 8.49986 
        12 8.49887ZM12 6.74902C10.9616 6.74902 9.94662 
        7.05693 9.08326 7.63381C8.2199 8.21068 7.54699 
        9.03062 7.14963 9.98993C6.75227 10.9492 6.64831 
        12.0048 6.85088 13.0232C7.05345 14.0416 7.55347 
        14.9771 8.28769 15.7113C9.02192 16.4456 9.95738 
        16.9456 10.9758 17.1481C11.9942 17.3507 13.0498 
        17.2467 14.0091 16.8494C14.9684 16.452 15.7883 
        15.7791 16.3652 14.9158C16.9421 14.0524 17.25 
        13.0374 17.25 11.999C17.25 10.6066 16.6969 9.27128 
        15.7123 8.28671C14.7277 7.30215 13.3924 6.74902 12 6.74902Z"
        fill="#0D0D0D"
      />
    </svg>
  </Icon>
);
