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

export const Facebook = (): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 10 20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="20"
      viewBox="0 0 10 20"
      fill="none"
    >
      <path
        d="M8.14996 3.29509H9.96164V0.139742C9.64908 0.0967442 8.57414 
        0 7.32226 0C4.71016 0 2.92081 1.643 2.92081 
        4.66274V7.44186H0.0383301V10.9693H2.92081V19.845H6.45487V10.9701H9.22076L9.65983 
        7.44269H6.45404V5.01251C6.45487 3.99297 6.72939 3.29509 8.14996 3.29509Z"
        fill="#1E2833"
      />
    </svg>
  </Icon>
);

export const Instagram = (): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 24 24">
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

export const Email = (): JSX.Element => (
  <Icon boxSize={5} viewBox="0 0 20 16">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
    >
      <path
        d="M18 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 
        15.0391 0 14.5304 0 14V1.913C0.0224326 1.39779 0.243009 0.911159 
        0.615678 0.554701C0.988347 0.198243 1.4843 -0.000487239 2 
        8.9712e-07H18C18.5304 8.9712e-07 19.0391 0.210714 19.4142 0.585787C19.7893 
        0.96086 20 1.46957 20 2V14C20 14.5304 19.7893 15.0391 19.4142 15.4142C19.0391 
        15.7893 18.5304 16 18 16ZM2 3.868V14H18V3.868L10 9.2L2 3.868ZM2.8 2L10 6.8L17.2 2H2.8Z"
        fill="black"
      />
    </svg>
  </Icon>
);
