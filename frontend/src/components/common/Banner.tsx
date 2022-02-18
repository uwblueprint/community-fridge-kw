import { Alert, AlertIcon, Link } from "@chakra-ui/react";
import React from "react";

const FeedbackBanner = () => (
  <Alert
    status="info"
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    color="hubbard.100"
    backgroundColor="cottonCandy.100"
  >
    <AlertIcon color="raddish.100" />
    As a beta user, we&#39;d love to know your feedback!&nbsp;
    <Link
      textDecoration="underline"
      href="https://docs.google.com/forms/d/e/1FAIpQLSfV5w_7krC5wJWGQys46cmydI5pPgyB0GSto73Pt-uKLlNiGA/viewform"
      isExternal
    >
      Click here to complete a short survey.
    </Link>{" "}
  </Alert>
);

export default FeedbackBanner;
