import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  CloseButton,
  Container,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hooks-helper";

import ContentAPIClient from "../../../APIClients/ContentAPIClient";
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
    url: ""
  });

  const onSaveClick = async () => {
    const contentResponse = await ContentAPIClient.updateContent(content?.id ?? "",
      {
        checkinDescription: (isCheckInView ? description : content?.checkinDescription) ?? "",
        checkinUrl: (isCheckInView ? url : content?.checkinUrl) ?? "",
        foodRescueDescription: (!isCheckInView ? description : content?.foodRescueDescription) ?? "",
        foodRescueUrl: (!isCheckInView ? url : content?.foodRescueUrl) ?? "",
      });

    setContent(contentResponse);
  };

  useEffect(() => {
    const getContent = async () => {
      const contentResponse = await ContentAPIClient.getContent();
      setContent(contentResponse);
    };

    getContent();
  }, []);

  return (
    <Container variant="responsiveContainer" maxWidth="100%" mt="2rem">
      <Box>
        <Box display="flex" justifyContent="right">
          <CloseButton />
        </Box>
        <Text textStyle="desktopHeader4" color="black.100">{`Edit ${isCheckInView ? `check in` : `food rescue`} description`}</Text>

        <Text textStyle="desktopSubtitle" color="black.100" mt="2rem">Edit description</Text>
        <Textarea
          mt="2.5rem"
          value={description}
          placeholder={isCheckInView ? content?.checkinDescription : content?.foodRescueDescription}
          name="description"
          onChange={setValue}
          width="478px"
          height="210px"
          background="squash.100"
          p="1.5rem"
        />

        <Text textStyle="desktopSubtitle" color="black.100" mt="3.5rem">Edit link</Text>

        <Input
          mt="2.5rem"
          value={url}
          name="url"
          placeholder={isCheckInView ? content?.checkinUrl : content?.foodRescueUrl}
          onChange={setValue}
          width="44rem"
          height="64px"
          background="squash.100"
        />

        <Box mt="5.5rem">
          <SaveButton onSaveClick={onSaveClick} />
        </Box>
      </Box>
    </Container>
  );
};

export default EditCheckInOrFoodRescue;
