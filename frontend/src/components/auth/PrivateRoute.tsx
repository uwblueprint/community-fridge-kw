import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );
};

export default PrivateRoute;
