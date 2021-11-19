import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import { Schedule } from "../../../types/SchedulingTypes";
import Scheduling from "../Scheduling";

const EditDashboard = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>();
  const getScheduleData = async () => {
    const scheduleResponse = await SchedulingAPIClient.getScheduleById(id);
    setCurrentSchedule(scheduleResponse);
  };

  useEffect(() => {
    getScheduleData();
  }, [id]);

  if (!currentSchedule) {
    return <div>Loading</div>;
  }

  return (
    currentSchedule && (
      <Scheduling schedulingData={currentSchedule} isBeingEdited />
    )
  );
};

export default EditDashboard;
