import { Center, Text } from "@chakra-ui/react";
import React from "react";

import MainPageButton from "../common/MainPageButton";

const CreatePage = (): React.ReactElement => {
  return (
    <Center>
      <Text fontSize="large" fontWeight="bold">
        Default Page
      </Text>
      <MainPageButton />
    </Center>
  );
};

export default CreatePage;
