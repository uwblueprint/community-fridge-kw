import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import colors from "./colors";
import Button from "./components/Button";
import Container from "./components/Container";
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
    Container,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
