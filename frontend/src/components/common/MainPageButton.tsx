import { Button } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";

import { HOME_PAGE } from "../../constants/Routes";

const MainPageButton = (): React.ReactElement => {
  const history = useHistory();
  const navigateTo = () => history.push(HOME_PAGE);
  return (
    <>
      <Button onClick={navigateTo} colorScheme="blue" align="center">
        Go Back
      </Button>
    </>
  );
};

export default MainPageButton;
