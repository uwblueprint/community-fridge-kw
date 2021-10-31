// import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface VolunteerRoleStepProps {
  title: string;
  description: string;
}
const VolunteerRoleStep = ({
  title,
  description,
}: VolunteerRoleStepProps): JSX.Element => {
  return (
    <Flex paddingBottom="1.5rem">
      {/* <ArrowForwardIcon flex="1" /> */}
      <Box flex="10">
        <Text color="white.100" textStyle="subHeading">
          {title}
        </Text>
        <Text color="white.100" textStyle="caption">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

const VolunteerRoles = () => {
  return (
    <Container
      pl="42px"
      pr="42px"
      pt="73px"
      backgroundColor="black.100"
      mt="57px"
      pb="73px"
    >
      <Text color="white.100" textStyle="subHeading" mb="1rem">
        For Donors
      </Text>
      <Text mb="1.5rem" color="white.100" textStyle="heading">
        THE DONATION PROCESS
      </Text>
      <VolunteerRoleStep
        title="Assist with a dropoff"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
      />
      <VolunteerRoleStep
        title="Conduct a check-in"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
      />

      <Button width="90%" variant="outline" backgroundColor="white.100">
        Start now
      </Button>
    </Container>
  );
};

export default VolunteerRoles;
