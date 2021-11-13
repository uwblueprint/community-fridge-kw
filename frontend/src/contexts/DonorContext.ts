import { createContext } from "react";

import { AuthenticatedDonor } from "../types/AuthTypes";

type DonorContextType = {
  authenticatedDonor: AuthenticatedDonor;
  setAuthenticatedDonor: (_authenticatedDonor: AuthenticatedDonor) => void;
};

const DonorContext = createContext<DonorContextType>({
  authenticatedDonor: null,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  setAuthenticatedDonor: (_authenticatedDonor: AuthenticatedDonor): void => {},
});

export default DonorContext;
