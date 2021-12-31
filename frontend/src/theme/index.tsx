import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import React from "react";

import colors from "./colors";
import Button from "./components/Button";
import textStyles from "./textStyles";

const customTheme = extendTheme({
  textStyles,
  colors,
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
