import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../../contexts/AuthContext";
import * as Routes from "../../../constants/Routes";

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
    <Flex
      paddingBottom="1.5rem"
      px="1.2rem"
      textAlign={{ md: "center" }}
      width="100%"
    >
      <Text
        width="22px"
        height="22px"
        borderRadius="50%"
        backgroundColor="cottonCandy.100"
        textStyle="mobileSmall"
        flex="1"
        color="poison.100"
        textAlign="center"
        marginRight="11px"
        marginTop="4px"
        display={{ base: "inline", md: "none" }}
      >
        {stepNumber}
      </Text>
      <Box flex="10">
        <Text color="black.100" textStyle="mobileHeader4">
          {title}
        </Text>
        <Text textStyle="mobileSmall">{description}</Text>
      </Box>
    </Flex>
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
      <Flex direction={{ base: "column", md: "row" }} padding="30px">
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
