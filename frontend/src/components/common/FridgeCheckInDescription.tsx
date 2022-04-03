import { EditIcon } from "@chakra-ui/icons";
import { Button, Link, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as Routes from "../../constants/Routes";
import ContentAPIClient from "../../APIClients/ContentAPIClient";
import { Content } from "../../types/ContentTypes";

const FridgeCheckInDescription = () => {
  const [content, setContent] = useState<Content>();

  const history = useHistory();
  const navigateToEditPage = () => {
    history.push(
      Routes.ADMIN_CHECK_IN_EDIT_DESCRIPTION_PAGE
    );
  };

  useEffect(() => {
    const getContent = async () => {
      const contentResponse = await ContentAPIClient.getContent();
      setContent(contentResponse);
    };

    getContent();
  }, []);

  return (
    <>
      <Text textStyle={["mobileHeader4", "desktopSubtitle"]} pt="2rem">
        Fridge check-in description
        <Button
          variant="editInfo"
          rightIcon={<EditIcon size={24} />}
          onClick={navigateToEditPage}
        />
      </Text>
      <Text textStyle={["mobileBody", "desktopBody"]} pt="2rem">
        {content?.checkinDescription}
        <br />
        <br />
        <Link
          color="#498FB6"
          textStyle={["mobileLink", "desktopLink"]}
          href={content?.checkinUrl}
          isExternal
        >
          Link to instructions
        </Link>
      </Text>
    </>
  )
};
export default FridgeCheckInDescription;
