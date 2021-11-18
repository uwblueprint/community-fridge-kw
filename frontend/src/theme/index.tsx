import { extendTheme } from "@chakra-ui/react";

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
      fontWeight: 700,
      letterSpacing: "-0.01rem",
    },
    mobileHeader3: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
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
    calendarEventTime: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      lineHeight: "16px",
      color: "black",
    },
    calendarEventHeader: {
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
    }
  },
  colors: {
    squash: {
      100: "#FAFCFE",
    },
    black: {
      100: "#0D0D0D",
    },
    gray: {
      100: "#C4C4C4",
    },
    green: {
      100: "#48BB78",
    },
    raddish: {
      100: "#C31887",
    },
    orange: {
      100: "#FC964C",
    },
    evergreen: {
      100: "#007980",
    },
    mint: {
      100: "#CBF7F0",
    },
    avocado: {
      100: "#94D969",
    },
    tomato: {
      100: "#D10000",
    },
    poison: {
      100: "#0E0E2C",
    },
    hubbard: {
      100: "#6C6C84",
    },
    dorian: {
      100: "#ECF1F4",
    },
    water: {
      100: "#C4DAD6",
    },
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
  },
  components: {
    Button,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
