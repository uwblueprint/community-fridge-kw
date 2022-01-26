import { extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import colors from "./colors";
import Button from "./components/Button";
import Container from "./components/Container";
import Input from "./components/Input";
import textStyles from "./textStyles";

const customTheme = extendTheme({
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
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
    Input,
  },
  config: {
    initialColorMode: "light",
  },
});

export default customTheme;
