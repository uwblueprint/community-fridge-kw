import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  fonts: {
    body: `Poppins`,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
