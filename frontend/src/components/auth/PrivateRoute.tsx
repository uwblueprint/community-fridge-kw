import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
  adminOnly?: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
  adminOnly,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  if (adminOnly) {
    return authenticatedUser?.role === Role.ADMIN ? (
      <Route path={path} exact={exact} component={component} />
    ) : (
      <Redirect to={Routes.LANDING_PAGE} />
    );
  }

  return authenticatedUser ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to={Routes.LOGIN_PAGE} />
  );
};

export default PrivateRoute;
