import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  textStyles: {
    heading: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "26px",
      lineHeight: "36px",
    },
    subHeading: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 700,
      fontSize: "15px",
      lineHeight: "18px",
    },
    body: {
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      lineHeight: "22px",
    },
    caption: {
      fontFamily: "Inter, sans-serif",
      fontSize: "12px",
      lineHeight: "18px",
    },
    inputDescription: {
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      lineHeight: "18px",
      fontWeight: 500,
    },
    subtitle: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: " 15px",
      lineHeight: "18px",
    },
    secondarySubheading: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      lineHeight: "18px",
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
    }
  },
  colors: {
    white: {
      100: "#FFFFFF",
    },
    black: {
      100: "#333333",
    },
    gray: {
      100: "#C4C4C4",
      200: "#3F4647",
      300: "#757575",
    },
    red: {
      100: "#DF7676",
    },
    green: {
      100: "#48BB78",
    },
    turnip: {
      100: "#BC577B",
      200: "#FCEFF2",
    },
    onion: {
      100: "#8557BC",
      200: "#F5EFFC",
    },
    H2O: {
      100: "#496DB6",
      200: "#EFF6FC",
    },
    spinach: {
      100: "#317C71",
      200: "#EFFCF9",
    },
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
