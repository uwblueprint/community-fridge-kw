import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Link, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import ContentAPIClient from "../../APIClients/ContentAPIClient";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { Content } from "../../types/ContentTypes";

const FridgeFoodRescueDescription = () => {
  const [content, setContent] = useState<Content>();
  const { authenticatedUser } = React.useContext(AuthContext);

  const history = useHistory();
  const navigateToEditPage = () => {
    history.push(Routes.ADMIN_FOOD_RESCUE_EDIT_DESCRIPTION_PAGE);
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
        Food rescue description
        {authenticatedUser?.role === Role.ADMIN && (
          <Button
            pl="8px"
            variant="edit"
            color="hubbard.100"
            float={["right", "initial"]}
            onClick={navigateToEditPage}
          >
            Edit
          </Button>
        )}
      </Text>
      {content?.foodRescueDescription && (
        <Text textStyle={["mobileBody", "desktopBody"]} pt="1rem" pb="0.25rem">
          {content?.foodRescueDescription}
        </Text>
      )}
      {content?.foodRescueUrl && (
        <>
          <Link
            pt="1.5rem"
            color="#498FB6"
            textStyle={["mobileLink", "desktopLink"]}
            href={content?.foodRescueUrl}
            textDecoration="underline"
            isExternal
          >
            Link to instructions
          </Link>
        </>
      )}
    </Box>
  );
};
export default FridgeFoodRescueDescription;
