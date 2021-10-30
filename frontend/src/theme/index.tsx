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
      fontWeight: "Bold",
      fontSize: "14px",
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
