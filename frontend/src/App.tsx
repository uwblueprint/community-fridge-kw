import { ChakraProvider } from "@chakra-ui/react";
import React, { useReducer, useState } from "react";
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
import CheckInsPage from "./components/pages/AdminDashboard/ViewCheckInsPage";
import ViewDonationsPage from "./components/pages/AdminDashboard/ViewDonationsPage";
import Dashboard from "./components/pages/Dashboard";
import EditDashboardSchedulePage from "./components/pages/Dashboard/EditDashboardSchedule";
import CreateCheckIn from "./components/pages/FridgeManagement/FridgeCheckIns";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import Scheduling from "./components/pages/Scheduling";
import UserManagement from "./components/pages/UserManagement";
import VolunteerShiftsPage from "./components/pages/VolunteerShifts";
import {
  AUTHENTICATED_USER_KEY,
  AUTHENTICATED_VOLUNTEER_CONTEXT_KEY,
} from "./constants/AuthConstants";
import * as Routes from "./constants/Routes";
import AuthContext from "./contexts/AuthContext";
import VolunteerContext, {
  DEFAULT_VOLUNTEER_CONTEXT,
} from "./contexts/VolunteerContext";
import VolunteerContextDispatcher from "./contexts/VolunteerContextDispatcher";
import volunteerContextReducer from "./reducers/VolunteerContextReducer";
import customTheme from "./theme/index";
import { AuthenticatedUser } from "./types/AuthTypes";
import { AuthenticatedVolunteerContext } from "./types/VolunteerTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );
  const currentVolunteer: AuthenticatedVolunteerContext = getLocalStorageObj<AuthenticatedVolunteerContext>(
    AUTHENTICATED_VOLUNTEER_CONTEXT_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  const [volunteerContext, dispatchVolunteerContextUpdate] = useReducer(
    volunteerContextReducer,
    currentVolunteer ?? DEFAULT_VOLUNTEER_CONTEXT,
  );
  return (
    <ChakraProvider theme={customTheme}>
      <VolunteerContext.Provider value={volunteerContext}>
        <VolunteerContextDispatcher.Provider
          value={dispatchVolunteerContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <FeedbackBanner />
              <Header />
              <Switch>
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <Route exact path={Routes.LANDING_PAGE} component={Home} />
                <PrivateRoute
                  adminOnly
                  exact
                  path={Routes.CREATE_CHECKIN}
                  component={CreateCheckIn}
                />
                <PrivateRoute
                  adminOnly
                  exact
                  path={Routes.USER_MANAGEMENT_PAGE}
                  component={UserManagement}
                />
                <PrivateRoute
                  exact
                  path={Routes.VOLUNTEER_SHIFTS_PAGE}
                  component={VolunteerShiftsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ACCOUNT_PAGE}
                  component={Account}
                />
                <PrivateRoute
                  adminOnly
                  exact
                  path={Routes.ADMIN_VIEW_DONATIONS}
                  component={ViewDonationsPage}
                />
                <PrivateRoute
                  adminOnly
                  exact
                  path={Routes.ADMIN_CHECK_INS}
                  component={CheckInsPage}
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
        </VolunteerContextDispatcher.Provider>
      </VolunteerContext.Provider>
    </ChakraProvider>
  );
};

export default App;
