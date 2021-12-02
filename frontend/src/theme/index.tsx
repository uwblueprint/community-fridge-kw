import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import Button from "./components/Button";

const customTheme = extendTheme({
  textStyles: {
    mobileHeader1: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "bold",
      lineHeight: "38px",
      fontSize: "28px",
      letterSpacing: "-0.01rem",
    },
    mobileHeader2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: "bold",
      letterSpacing: "-0.01rem",
    },
    mobileHeader3: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "bold",
      fontSize: "20px",
      lineHeight: "28px",
    },
    mobileHeader4: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "28px",
    },
    mobileBody: {
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      lineHeight: "28px",
    },
    mobileBodyBold: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      lineHeight: "22px",
    },
    mobileSmall: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "20px",
    },
    mobilePretitleBold: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "18px",
      letterSpacing: "0.02rem",
    },
    mobileLink: {
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      lineHeight: "22px",
    },
    mobileCardDescription: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: "20px",
    },
    calendarDate: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "20px",
      lineHeight: "28px",
    },
    desktopSmall: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      lineHeight: "16px",
      color: "black",
    },
    desktopBodyBold: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "16px",
      lineHeight: "19px",
      color: "black",
    },
    desktopHeader: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "24px",
      lineHeight: "34px",
      color: "black",
    },
    desktopHeader2: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "32px",
      lineHeight: "42px",
      color: "black",
    },
    desktopSubtitle: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "20px",
      lineHeight: "28px",
      color: "black",
    },
    popupTitleText: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "22px",
      color: "black",
    },
    popupInformationText: {
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      lineHeight: "24px",
      color: "black",
    },
  },
  colors: {
    raddish: {
      50: "#ffe5f9",
      100: "#C31887",
      200: "#f38dcf",
      300: "#ec5fbb",
      400: "#e633a7",
      500: "#cc198d",
      600: "#a0116e",
      700: "#720a50",
      800: "#470330",
      900: "#1d0013",
    },
    black: {
      // colorScheme prop requires a full range of colours in Chakra
      50: "#EDF2F7",
      100: "#171717",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#171717",
      600: "#171717",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
    squash: {
      100: "#FAFCFE",
    },
    hubbard: {
      100: "#6C6C84",
    },
    dorian: {
      100: "#ECF1F4",
    },
    tomato: {
      100: "#D10000",
    },
    champagne: {
      100: "#8D2569",
    },
    strawberry: {
      100: "#F0C5E1",
    },
    cottonCandy: {
      100: "#FDF5FA",
    },
    spinach: {
      50: "#EFFCF9",
      100: "#317C71",
    },
    h20: {
      50: "#EFF6FC",
      100: "#496DB6",
    },
    onion: {
      50: "#F5EFFC",
      100: "#8557BC",
    },
    turnip: {
      50: "#FCEFF2",
      100: "#BC577B",
    },
    gray: {
      100: "#C4C4C4",
    },
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
  },
  components: {
    Button,
    Steps,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
