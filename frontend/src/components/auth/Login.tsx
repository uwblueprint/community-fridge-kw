import { Box, Button, Input } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect, useHistory } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

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

  const onGoogleLoginSuccess = async (tokenId: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      tokenId,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <Box style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form>
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
            colorScheme="blue"
            variant="solid"
          >
            Log In
          </Button>
        </Box>
        <GoogleLogin
          clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}
          buttonText="Login with Google"
          onSuccess={(response: GoogleResponse): void => {
            if ("tokenId" in response) {
              onGoogleLoginSuccess(response.tokenId);
            } else {
              // eslint-disable-next-line no-alert
              window.alert(response);
            }
          }}
          style={{ width: "20%" }}
          // eslint-disable-next-line no-alert
          onFailure={(error) => window.alert(error)}
        />
      </form>
      <Box>
        <Button
          mt="2"
          colorScheme="blue"
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
