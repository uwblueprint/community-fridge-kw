import {
  Box,
  Button,
  Container,
  Flex,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import * as Routes from "../../../constants/Routes";
import AuthContext from "../../../contexts/AuthContext";
import { CheckIn } from "../../../types/CheckInTypes";
import CheckInCard from "./CheckInCard";

const FoodRescues = (): JSX.Element => {
  const { authenticatedUser } = useContext(AuthContext);
  // const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    const getCheckIns = async () => {
      const checkInResponse = await CheckInAPIClient.getAllCheckIns();
      setCheckIns(checkInResponse);
    };

    getCheckIns();
  }, []);

  if (!checkIns || checkIns === null) {
    return <Spinner />;
  }

  return (
    <div>
      <Text pt="0.8rem" textStyle="mobileBody" color="hubbard.100">
        Food rescue description + links from rescues service{" "}
      </Text>
      <Box
        display={{ lg: "flex" }}
        flexDirection="row"
        flexWrap="wrap"
        marginTop={["60px", "70px"]}
      >
        {checkIns.length > 0 ? (
          <p>Hello food rescues here</p>
        ) : (
          <Flex paddingTop="1.5rem">
            <Box
              display={{ lg: "flex" }}
              width={{ base: "default", md: "100%" }}
              backgroundColor="squash.100"
              padding={{ base: "0px", md: "3rem" }}
            >
              <Text
                p={{ base: "28px", md: "0px" }}
                color="black.500"
                textStyle="mobileBody"
              >
                There are currently no food rescues available for signup! &nbsp;
              </Text>
              {/* <Text
                    pl={{ base: "28px", md: "0px" }}
                    px={{ base: "28px", md: "0px" }}
                    color="black.500"
                    textStyle="mobileBody"
                  >
                    Schedule a donation today to start giving back.
                  </Text> */}
            </Box>
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default FoodRescues;
