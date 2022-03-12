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
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser, Role } from "../../types/AuthTypes";
import HeaderLabel from "../common/HeaderLabel";

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [{ email, password }, setValue] = useForm({ email: "", password: "" });
  const [
    isIncorrectLoginCredentails,
    setIsIncorrectLoginCredentails,
  ] = React.useState(false);

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    if (user === null) {
      setIsIncorrectLoginCredentails(true);
    }
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return authenticatedUser.role === Role.ADMIN ? (
      <Redirect to={Routes.ADMIN_VIEW_DONATIONS} />
    ) : (
      <Redirect to={Routes.DASHBOARD_PAGE} />
    );
  }

  return (
    <Container p={{ base: "30px", md: "2rem 1rem" }}>
      <HeaderLabel text="Log in to start scheduling" />
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
          <Link to={Routes.FORGET_PASSWORD}> Forgot password? </Link>
        </Text>
        {isIncorrectLoginCredentails && (
          <Text
            my="48px"
            textStyle={["mobileSmall", "desktopSmall"]}
            color="tomato.100"
          >
            An incorrect email address or password was entered. Please try
            again!
          </Text>
        )}
        <Box mt="2.5rem">
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
            textStyle={["mobileSmall", "desktopSmall"]}
            color="champagne.100"
            display="inline-block"
            textDecorationLine="underline"
          >
            <Link to={Routes.SIGNUP_PAGE}> Sign up now </Link>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
