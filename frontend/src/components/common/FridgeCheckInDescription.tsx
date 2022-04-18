import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Link, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ContentAPIClient from "../../APIClients/ContentAPIClient";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { Content } from "../../types/ContentTypes";

const FridgeCheckInDescription = () => {
  const [content, setContent] = useState<Content>();
  const { authenticatedUser } = React.useContext(AuthContext);

  const history = useHistory();
  const navigateToEditPage = () => {
    history.push(Routes.ADMIN_CHECK_IN_EDIT_DESCRIPTION_PAGE);
  };

  useEffect(() => {
    const getContent = async () => {
      const contentResponse = await ContentAPIClient.getContent();
      setContent(contentResponse);
    };

    getContent();
  }, []);

  return (
    <Box mb="4rem">
      <Text textStyle={["mobileHeader4", "mobileHeader3"]} pt="1rem">
        Fridge check-in description
        {authenticatedUser?.role === Role.ADMIN && (
          <Button
            variant="editInfo"
            rightIcon={<EditIcon size={24} />}
            onClick={navigateToEditPage}
          />
        )}
      </Text>
      {content?.checkinDescription && (
        <Text textStyle={["mobileBody", "desktopBody"]} pt="1rem">
          {content?.checkinDescription}
        </Text>
      )}
      {content?.checkinUrl && (
        <>
          <br />
          <Link
            color="#498FB6"
            textStyle={["mobileLink", "desktopLink"]}
            href={content?.checkinUrl}
            isExternal
          >
            Link to instructions
          </Link>
        </>
      )}
    </Box>
  );
};
export default FridgeCheckInDescription;
