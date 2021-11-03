import { Box, Container, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { LANDING_PAGE } from "../../constants/Routes";
import { CloseIcon } from "../common/icons";

const VerificationPage = () => {
  const history = useHistory();

  return (
    <>
      <IconButton
        aria-label="close page"
        float="right"
        backgroundColor="transparent"
        onClick={() => history.push(LANDING_PAGE)}
      >
        <CloseIcon color="#111111" />
      </IconButton>
      <Container centerContent pl="42px" pr="42px" pt="73px">
        <Box w="200px" h="140px" backgroundColor="gray.100" />
        <Text mt="1rem" textAlign="center" textStyle="heading">
          Please verify your email address!
        </Text>
        <Text
          mt="1rem"
          textAlign="center"
          textStyle="secondarySubheading"
          color="gray.300"
        >
          We sent a verfication email to john.doe@gmail.com. Please check your
          email to begin scheduling your first dropoff!
        </Text>
      </Container>
    </>
  );
};

export default VerificationPage;
