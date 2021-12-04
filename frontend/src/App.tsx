import { ChakraProvider } from "@chakra-ui/react";
import React, { useReducer, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import VerificationPage from "./components/auth/Signup/VerificationEmail";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Account from "./components/pages/Account";
import Dashboard from "./components/pages/Dashboard";
import EditDashboardSchedulePage from "./components/pages/Dashboard/EditDashboardSchedule";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Scheduling from "./components/pages/Scheduling";
import ThankYou from "./components/pages/Scheduling/ThankYou";
import ViewDonations from "./components/pages/ViewDonations";
import { AUTHENTICATED_USER_KEY } from "./constants/AuthConstants";
import * as Routes from "./constants/Routes";
import AuthContext from "./contexts/AuthContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
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

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <Header />
              <Switch>
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <Route exact path={Routes.LANDING_PAGE} component={Home} />
                <Route exact path={Routes.ACCOUNT_PAGE} component={Account} />
                <Route
                  exact
                  path={Routes.VIEW_DONATIONS}
                  component={ViewDonations}
                />
                <Route
                  exact
                  path={Routes.DASHBOARD_SCHEDULE_EDIT_PAGE}
                  component={EditDashboardSchedulePage}
                />
                <Route
                  exact
                  path={Routes.DASHBOARD_PAGE}
                  component={Dashboard}
                />
                <Route
                  exact
                  path={Routes.SCHEDULING_PAGE}
                  component={Scheduling}
                />
                <Route exact path="*" component={NotFound} />
              </Switch>
              <Footer />
            </Router>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
