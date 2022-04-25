import { Box, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";

import donationStep1 from "../../../assets/donation-process/DonationStep1.png";
import donationStep2 from "../../../assets/donation-process/DonationStep2.png";
import donationStep3 from "../../../assets/donation-process/DonationStep3.png";
import useViewport from "../../../hooks/useViewport";

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
  const { isDesktop } = useViewport();
  const stepImages = [donationStep1, donationStep2, donationStep3];

  return (
    <Stack
      paddingBottom="1.5rem"
      px={{ base: "0px", md: "1.2rem" }}
      textAlign={{ md: "center" }}
      width="100%"
      alignItems="center"
      direction={{ base: "row", md: "column" }}
    >
      {isDesktop ? (
        <Image
          objectFit="cover"
          height="120px"
          src={stepImages[stepNumber - 1]}
          alt="Size image"
          display="inline"
        />
      ) : (
        <Text
          width={{ base: "22px", md: "70px" }}
          height={{ base: "22px", md: "70px" }}
          lineHeight={{ base: "22px", md: "70px" }}
          borderRadius="100%"
          backgroundColor="cottonCandy.100"
          textStyle={["mobileSmall", "desktopIconNumber"]}
          color="hubbard.100"
          textAlign="center"
          marginRight="12px"
          verticalAlign="top"
          marginBottom="12px"
        >
          {stepNumber}
        </Text>
      )}
      <Box flex="10">
        <Text color="black.100" textStyle={["mobileHeader4", "desktopHeader4"]}>
          {title}
        </Text>
        <Text
          color="hubbard.100"
          textStyle={["mobileSmall", "desktopBody"]}
          pt="2px"
        >
          {description}
        </Text>
      </Box>
    </Stack>
  );
};

const DonationProcess = (): JSX.Element => {
  return (
    <Box mt="30px">
      <Text
        color="hubbard.100"
        textStyle={["mobilePretitleBold", "desktopSubtitle"]}
        mb="1rem"
      >
        For donors
      </Text>
      <Text
        color="black.100"
        textStyle={["mobileHeader2", "desktopHeader2"]}
        mb="1.5rem"
      >
        The Donation Process
      </Text>
      <Stack direction={["column", "row"]} gap="1rem">
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
      </Stack>
    </Box>
  );
};

export default DonationProcess;
