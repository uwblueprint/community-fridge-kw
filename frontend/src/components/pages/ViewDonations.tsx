import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import AdminCalendar from "./AdminCalendar";

const ViewDonations = (): React.ReactElement => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  return (
    <>
      <AdminCalendar selectedDay={selectedDay} />
    </>
  );
};

export default ViewDonations;
