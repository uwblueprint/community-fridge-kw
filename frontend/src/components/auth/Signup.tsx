import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSignupClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  return (
    <Center>
      <Stack w="20%">
        <h1>Signup</h1>
        <form>
          <div>
            <Input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First Name"
            />
          </div>
          <div>
            <Input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="username@domain.com"
            />
          </div>
          <div>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="123-456-7890"
            />
          </div>
          <div>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <div>
            <Button
              mt="2"
              colorScheme="blue"
              variant="solid"
              onClick={onSignupClick}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </Stack>
    </Center>
  );
};

export default Signup;
