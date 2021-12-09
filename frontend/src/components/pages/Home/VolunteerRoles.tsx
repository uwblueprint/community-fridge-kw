import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Spacer, Text } from "@chakra-ui/react";
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
    <Flex paddingBottom="1.5rem" mr="1rem">
      <Box
        flex="10"
        backgroundColor="cottonCandy.100"
        borderRadius="16px"
        padding={{ base: "0px", md: "3rem" }}
      >
        <Text color="black.100" textStyle="mobileBodyBold">
          <ArrowForwardIcon
            width="24px"
            display={{ base: "inline", md: "none" }}
          />
          {title}
        </Text>
        <Text
          pl={{ base: "24px", md: "0px" }}
          color="hubbard.100"
          textStyle="mobileSmall"
        >
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

const VolunteerRoles = () => (
  <Box
    backgroundColor={{ base: "cottonCandy.100", md: "white" }}
    mt="57px"
    pb="2rem"
    px={{ base: "42px", md: "0px" }}
    pt={{ base: "73px", md: "0px" }}
    mx={{ base: "-42px", md: "0px" }}
  >
    <Text color="hubbard.100" textStyle="mobilePretitleBold" mb="1rem">
      For Volunteers
    </Text>
    <Text mb="1.5rem" color="black.100" textStyle="mobileHeader2">
      Volunteer Roles
    </Text>
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      <VolunteerRoleStep
        title="Sign up for a fridge check-in"
        description="Visit the fridge in your desired time window to complete one of the three daily fridge check-ins to maintain public health standards."
      />
      <Spacer />
      <VolunteerRoleStep
        title="Assist with food rescue"
        description="Support a donation from a local business, organization or individual by making a pick-up or assisting with donation unloading and stocking at the fridge."
      />
    </Flex>
  </Box>
);

export default VolunteerRoles;
