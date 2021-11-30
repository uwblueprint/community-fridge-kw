import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Text } from "@chakra-ui/react";
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
      <Box flex="10">
        <Text color="black.100" textStyle="mobileBodyBold">
          <ArrowForwardIcon width="24px" />
          {title}
        </Text>
        <Text pl="24px" color="hubbard.100" textStyle="mobileSmall">
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

const VolunteerRoles = () => (
  <Container
    pl="42px"
    pr="42px"
    pt="73px"
    backgroundColor="cottonCandy.100"
    mt="57px"
    pb="120px"
  >
    <Text color="hubbard.100" textStyle="mobilePretitleBold" mb="1rem">
      For Volunteers
    </Text>
    <Text mb="1.5rem" color="black.100" textStyle="mobileHeader2">
      Volunteer Roles
    </Text>
    <VolunteerRoleStep
      title="Assist with a dropoff"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
    />
    <VolunteerRoleStep
      title="Conduct a check-in"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut condimentum libero. Cras sodales."
    />
  </Container>
);

export default VolunteerRoles;
