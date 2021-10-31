import { Box, Button, FormControl, Input, Text } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    setAuthenticatedUser(user);
  };

  const onSignUpClick = () => {
    history.push(SIGNUP_PAGE);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <Box textAlign="center">
      <Text mt="2" textStyle="heading">
        Login
      </Text>
      <FormControl>
        <Box>
          <Input
            w="20%"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
        </Box>
        <Box>
          <Input
            w="20%"
            mt="2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </Box>
        <Box>
          <Button
            m="2"
            onClick={onLogInClick}
            colorScheme="blackAlpha"
            variant="solid"
          >
            Log In
          </Button>
        </Box>
      </FormControl>
      <Box>
        <Button
          mt="2"
          colorScheme="blackAlpha"
          variant="solid"
          onClick={onSignUpClick}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
