import { ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Action from "./components/auth/Action";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import ResetPassword from "./components/auth/ResetPassword/index";
import Signup from "./components/auth/Signup";
import FeedbackBanner from "./components/common/Banner";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Account from "./components/pages/Account";
import Dashboard from "./components/pages/Dashboard";
import EditDashboardSchedulePage from "./components/pages/Dashboard/EditDashboardSchedule";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Scheduling from "./components/pages/Scheduling";
import UserManagement from "./components/pages/UserManagement";
import ViewDonationsPage from "./components/pages/ViewDonationsPage";
import { AUTHENTICATED_USER_KEY } from "./constants/AuthConstants";
import * as Routes from "./constants/Routes";
import AuthContext from "./contexts/AuthContext";
import customTheme from "./theme/index";
import { AuthenticatedUser } from "./types/AuthTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <Router>
          <FeedbackBanner />
          <Header />
          <Switch>
            <Route exact path={Routes.LOGIN_PAGE} component={Login} />
            <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
            <Route exact path={Routes.LANDING_PAGE} component={Home} />
            <PrivateRoute
              exact
              path={Routes.USER_MANAGEMENT_PAGE}
              component={UserManagement}
            />
            <PrivateRoute
              exact
              path={Routes.ACCOUNT_PAGE}
              component={Account}
            />
            <Route
              exact
              path={Routes.VIEW_DONATIONS}
              component={ViewDonationsPage}
            />
            <PrivateRoute
              exact
              path={Routes.DASHBOARD_SCHEDULE_EDIT_PAGE}
              component={EditDashboardSchedulePage}
            />
            <PrivateRoute
              exact
              path={Routes.DASHBOARD_PAGE}
              component={Dashboard}
            />
            <PrivateRoute
              exact
              path={Routes.SCHEDULING_PAGE}
              component={Scheduling as React.FC}
            />
            <Route path={Routes.ACTION} component={Action} />
            <Route
              exact
              path={Routes.FORGET_PASSWORD}
              component={ResetPassword}
            />
            <Route exact path="*" component={NotFound} />
          </Switch>
          <Footer />
        </Router>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;
