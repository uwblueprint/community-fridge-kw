import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
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
    <Flex paddingBottom="1.5rem" width={["100%", "50%"]}>
      <Box
        flex="10"
        backgroundColor="cottonCandy.100"
        borderRadius="16px"
        padding={{ base: "0px", md: "3rem" }}
      >
        <Text
          color="black.100"
          textStyle={["mobileHeader4", "desktopHeader4"]}
          mb="1rem"
        >
          <ArrowForwardIcon
            width="24px"
            display={{ base: "inline", md: "none" }}
          />
          {title}
        </Text>
        <Text
          pl={{ base: "24px", md: "0px" }}
          color="hubbard.100"
          textStyle={["mobileSmall", "desktopBody"]}
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
    p={["73px 42px 73px 42px", "0"]}
    mx={["-42px", "0"]}
    mb={["-79px", "0"]}
  >
    <Text
      color="hubbard.100"
      textStyle={["mobilePretitleBold", "desktopSubtitle"]}
      mb="1rem"
    >
      For volunteers
    </Text>
    <Text
      color="black.100"
      textStyle={["mobileHeader2", "desktopHeader2"]}
      mb="1.5rem"
    >
      Volunteer Roles
    </Text>
    <Stack direction={["column", "row"]} gap="1rem">
      <VolunteerRoleStep
        title="Sign up for a fridge check-in"
        description="Visit the fridge in your desired time window to complete one of the three daily fridge check-ins to maintain public health standards."
      />
      <Spacer />
      <VolunteerRoleStep
        title="Assist with food rescue"
        description="Support a donation from a local business, organization or individual by making a pickup or assisting with donation unloading and stocking at the fridge."
      />
    </Stack>
  </Box>
);

export default VolunteerRoles;
