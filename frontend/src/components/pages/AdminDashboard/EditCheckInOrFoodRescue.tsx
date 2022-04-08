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
import { useForm } from "react-hooks-helper";
import { useHistory } from "react-router-dom";

import ContentAPIClient from "../../../APIClients/ContentAPIClient";
import * as Routes from "../../../constants/Routes";
import { Content } from "../../../types/ContentTypes";
import SaveButton from "../Scheduling/SaveChangesButton";

const EditCheckInOrFoodRescue = ({
  isCheckInView = false,
}: {
  isCheckInView?: boolean;
}): React.ReactElement => {
  const [content, setContent] = useState<Content>();
  const [{ description, url }, setValue] = useForm({
    description: "",
    url: "",
  });

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
    const contentResponse = await ContentAPIClient.updateContent(
      "1",
      {
        checkinDescription:
          (isCheckInView ? description : content?.checkinDescription) ?? "",
        checkinUrl: (isCheckInView ? url : content?.checkinUrl) ?? "",
        foodRescueDescription:
          (!isCheckInView ? description : content?.foodRescueDescription) ?? "",
        foodRescueUrl: (!isCheckInView ? url : content?.foodRescueUrl) ?? "",
      },
    );

    setContent(contentResponse);
    navigateToViewPage();
  };

  useEffect(() => {
    const getContent = async () => {
      const contentResponse = await ContentAPIClient.getContent();
      setContent(contentResponse);
    };

    getContent();
  }, []);

  return (
    <Container alignContent="left" variant="calendarContainer" mt={["0.5rem", "2rem"]}>
      <Box>
        <Box display="flex" justifyContent="right">
          <CloseButton onClick={navigateToViewPage} />
        </Box>
        <Text textStyle="desktopHeader4" color="black.100">{`Edit ${isCheckInView ? `check in` : `food rescue`
          } description`}</Text>

        <Text textStyle={["mobileHeader4", "desktopSubtitle"]} color="black.100" mt={["34px", "35px"]}>
          Edit description
        </Text>
        <Textarea
          mt={["17px", "42px"]}
          value={description}
          placeholder={
            isCheckInView
              ? content?.checkinDescription
              : content?.foodRescueDescription
          }
          name="description"
          onChange={setValue}
          width={["100%", "478px"]}
          height={["140px", "210px"]}
          background="squash.100"
          p="1.5rem"
        />

        <Text textStyle={["mobileHeader4", "desktopSubtitle"]} color="black.100" mt={["36px", "56px"]}>
          Edit link
        </Text>

        <Input
          mt={["17px", "42px"]}
          value={url}
          name="url"
          placeholder={
            isCheckInView ? content?.checkinUrl : content?.foodRescueUrl
          }
          onChange={setValue}
          width={["100%", "44rem"]}
          height={["44px", "64px"]}
          background="squash.100"
        />

        <Flex mt={["60px", "87px"]} direction="column"> 
          <Button onClick={onSaveClick} variant="navigation"  width={["100%","218px"]} alignSelf="flex-end">
            Save changes
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default EditCheckInOrFoodRescue;
