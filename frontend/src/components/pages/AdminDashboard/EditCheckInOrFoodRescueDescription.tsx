import {
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ContentAPIClient from "../../../APIClients/ContentAPIClient";
import * as Routes from "../../../constants/Routes";
import { Content } from "../../../types/ContentTypes";

const EditCheckInOrFoodRescueDescription = ({
  isCheckInView = false,
}: {
  isCheckInView?: boolean;
}): React.ReactElement => {
  const [content, setContent] = useState<Content>({
    id: "1",
    foodRescueDescription: "",
    foodRescueUrl: "",
    checkinDescription: "",
    checkinUrl: "",
  });
  const [interactedWith, setInteractedWith] = useState(false);

  const history = useHistory();
  const navigateToViewPage = () => {
    history.push(
      isCheckInView ? Routes.ADMIN_CHECK_INS : Routes.ADMIN_VIEW_DONATIONS,
    );
  };

  useEffect(() => {
    const getContent = async () => {
      const contentResponse = await ContentAPIClient.getContent();
      setContent(contentResponse);
    };

    getContent();
  }, []);

  const onSaveClick = async () => {
    if (
      content &&
      content.checkinDescription.length !== 0 &&
      content.checkinUrl.length !== 0 &&
      content.foodRescueDescription.length !== 0 &&
      content.foodRescueUrl.length !== 0
    ) {
      const contentResponse = await ContentAPIClient.updateContent(
        "1",
        content,
      );
      setContent(contentResponse);
      navigateToViewPage();
    }
  };

  return (
    <Container
      alignContent="left"
      variant="calendarContainer"
      mt={["0.5rem", "2rem"]}
    >
      <Box>
        <Box display="flex" justifyContent="right">
          <CloseButton onClick={navigateToViewPage} />
        </Box>
        <Text textStyle="desktopHeader4" color="black.100">{`Edit ${
          isCheckInView ? `check-in` : `food rescue`
        } description`}</Text>

        <Text
          textStyle={["mobileHeader4", "desktopSubtitle"]}
          color="black.100"
          mt={["34px", "35px"]}
        >
          Edit description
        </Text>
        <Textarea
          mt={["17px", "16px"]}
          value={
            isCheckInView
              ? content.checkinDescription
              : content.foodRescueDescription
          }
          name="description"
          onChange={(e) =>
            content &&
            setContent({
              ...content,
              ...(isCheckInView
                ? { checkinDescription: e.target.value }
                : { foodRescueDescription: e.target.value }),
            })
          }
          onFocus={() => setInteractedWith(true)}
          width={["100%", "478px"]}
          height={["140px", "210px"]}
          background="squash.100"
          p="1.5rem"
          isInvalid={
            ((isCheckInView && !content.checkinDescription) ||
              (!isCheckInView && !content.foodRescueDescription)) &&
            interactedWith
          }
        />

        <Text
          textStyle={["mobileHeader4", "desktopSubtitle"]}
          color="black.100"
          mt={["36px", "56px"]}
        >
          Edit link
        </Text>

        <Input
          mt={["17px", "16px"]}
          name="url"
          value={isCheckInView ? content.checkinUrl : content?.foodRescueUrl}
          onChange={(e) => {
            if (content) {
              setContent({
                ...content,
                ...(isCheckInView
                  ? { checkinUrl: e.target.value }
                  : { foodRescueUrl: e.target.value }),
              });
            }
          }}
          onFocus={() => setInteractedWith(true)}
          width={["100%", "44rem"]}
          height={["44px", "64px"]}
          background="squash.100"
          isInvalid={
            (isCheckInView && !content.checkinUrl) ||
            (!isCheckInView && !content?.foodRescueUrl && interactedWith)
          }
        />

        <Flex mt={["60px", "87px"]} direction="column">
          <Button
            onClick={onSaveClick}
            variant="navigation"
            width={["100%", "218px"]}
            alignSelf="flex-end"
          >
            Save changes
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default EditCheckInOrFoodRescueDescription;
