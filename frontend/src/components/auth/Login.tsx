import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useForm } from "react-hooks-helper";
import { Link, Redirect } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { DASHBOARD_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [{ email, password }, setValue] = useForm({ email: "", password: "" });

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={DASHBOARD_PAGE} />;
  }

  return (
    <>
      <Container pl="42px" pr="42px" pt="73px">
        <Text mt="2" textStyle="mobileHeader1">
          Log in to account
        </Text>
        <FormControl mt="2rem">
          <Box>
            <Text textStyle="mobileBodyBold" color="black.100">
              Email Address
            </Text>
            <Input
              mt="2"
              value={email}
              name="email"
              onChange={setValue}
              placeholder="Enter email address"
            />
          </Box>
          <Box mt="1rem">
            <Text textStyle="mobileBodyBold" color="black.100">
              Password
            </Text>
            <Input
              mt="2"
              value={password}
              name="password"
              onChange={setValue}
              type="password"
              placeholder="Enter password"
            />
          </Box>
          <Text mt="1rem" color="hubbard.100" textStyle="mobileSmall">
            Forgot password?
          </Text>
          <Box mt="1rem">
            <Button
              width="100%"
              mt="2"
              onClick={onLogInClick}
              variant="navigation"
            >
              Log In
            </Button>
          </Box>
        </FormControl>
        <Box>
          <Stack display="inline">
            <Text display="inline-block" color="hubbard.100" mt="1rem">
              Dont have an account? &nbsp;
            </Text>
            <Text
              fontWeight="bold"
              color="champagne.100"
              display="inline-block"
              textDecorationLine="underline"
            >
              <Link to={SIGNUP_PAGE}> Sign up now </Link>
            </Text>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Login;
