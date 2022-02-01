import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";

interface DonationStepProps {
  title: string;
  description: string;
  stepNumber: number;
}
const DonationStep = ({
  title,
  description,
  stepNumber,
}: DonationStepProps): JSX.Element => {
  return (
    <Stack
      paddingBottom="1.5rem"
      px={{ base: "0px", md: "1.2rem" }}
      textAlign={{ md: "center" }}
      width="100%"
      alignItems="center"
      direction={{ base: "row", md: "column" }}
    >
      <Text
        width={{ base: "22px", md: "70px" }}
        height={{ base: "22px", md: "70px" }}
        lineHeight={{ base: "22px", md: "70px" }}
        borderRadius="100%"
        backgroundColor="cottonCandy.100"
        textStyle={{ base: "mobileSmall", md: "desktopIconNumber" }}
        color="hubbard.100"
        textAlign="center"
        marginRight="12px"
        verticalAlign="top"
        marginBottom="12px"
      >
        {stepNumber}
      </Text>
      <Box flex="10">
        <Text color="black.100" textStyle="mobileHeader4">
          {title}
        </Text>
        <Text textStyle="mobileSmall">{description}</Text>
      </Box>
    </Stack>
  );
};

const DonationProcess = (): JSX.Element => {
  const history = useHistory();
  const { authenticatedUser } = useContext(AuthContext);

  return (
    <Box mt="57px">
      <Text color="hubbard.100" textStyle="mobilePretitleBold" mb="1rem">
        For Donors
      </Text>
      <Text mb="1.5rem" color="black.100" textStyle="mobileHeader2">
        The Donation Process
      </Text>
      <Flex direction={{ base: "column", md: "row" }}>
        <DonationStep
          stepNumber={1}
          title="Create an account"
          description="Join us as a donor on our donation platform."
        />
        <DonationStep
          stepNumber={2}
          title="Schedule a food donation"
          description="Use the donor platform to schedule your donations to the community fridge."
        />
        <DonationStep
          stepNumber={3}
          title="Complete your donation"
          description="Complete your donation and feel good about redistributing food in our community."
        />
      </Flex>

      <Button
        width="100%"
        variant="navigation"
        size="lg"
        display={{ md: "none" }}
        onClick={() =>
          history.push(
            authenticatedUser ? Routes.SCHEDULING_PAGE : Routes.LOGIN_PAGE,
          )
        }
      >
        Start now
      </Button>
    </Box>
  );
};

export default DonationProcess;
