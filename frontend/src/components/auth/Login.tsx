import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";
import Header from "../common/Header";

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <>
      <Header />
      <Container pl="42px" pr="42px" pt="73px">
        <Text mt="2" textStyle="heading">
          Log into account
        </Text>
        <FormControl mt="2rem">
          <Box>
            <Text textStyle="inputDescription">Email Address</Text>
            <Input
              mt="2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Box>
          <Box mt="1rem">
            <Text textStyle="inputDescription">Password</Text>
            <Input
              mt="2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Box>
          <Text mt="1rem" color="gray.300" textStyle="subtitle">
            Forgot password?
          </Text>
          <Box mt="1rem">
            <Button
              mt="2"
              onClick={onLogInClick}
              backgroundColor="black.100"
              color="white.100"
              size="md"
              w="100%"
            >
              Log In
            </Button>
          </Box>
        </FormControl>
        <Box>
          <Stack display="inline">
            <Text display="inline-block" color="gray.300" mt="1rem">
              Dont have an account? &nbsp;
            </Text>
            <Text
              fontWeight="bold"
              color="gray.300"
              display="inline-block"
              textDecorationLine="underline"
            >
              <Link to="/signup"> Sign up now </Link>
            </Text>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Login;
