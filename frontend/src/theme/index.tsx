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
