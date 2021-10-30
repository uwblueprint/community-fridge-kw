import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  textStyles: {
    body: {
      fontFamily: "Inter, sans-serif",
    },
    heading: {
      fontFamily: "Inter, sans-serif",
      fontWeight: "Bold",
      fontSize: "26px",
    },
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
