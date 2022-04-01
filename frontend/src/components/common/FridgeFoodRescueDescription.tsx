import { EditIcon } from "@chakra-ui/icons";
import { Button, Link, Text } from "@chakra-ui/react";
import React from "react";

export const FridgeFoodRescueDescription = () => (
  <>
    <Text textStyle={["mobileHeader4", "desktopSubtitle"]} pt="2rem">
      Scheduled donations
      <Button
        variant="editInfo"
        rightIcon={<EditIcon size={24} />}
        onClick={() => alert("Edit content clicked!")}
      />
    </Text>
    <Text textStyle={["mobileBody", "desktopBody"]} pt="2rem">
      Select a card to see more details pertaining to the upcoming donation.
      Select a card to see more details pertaining to the upcoming donation.
      Select select a card to see more details pertaining to the Select a card
      upcoming donation. Select a card to see more details pertaining to the
      upcoming donation. Select a card to see more details pertaining to the
      upcoming donation. Select a card Select a card to see more details
      pertaining to the upcoming donation. Select a card to see more details
      pertaining to the upcoming donation.
      <Link
        color="#498FB6"
        textDecoration="underline"
        textStyle={["mobileLink", "desktopLink"]}
        href="www.google.com"
        isExternal
      >
        Link to instructions
      </Link>
    </Text>
  </>
);
