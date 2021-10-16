import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  fonts: {
    header: "Poppins",
    body: `Poppins`,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
