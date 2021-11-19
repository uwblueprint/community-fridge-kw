import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Container,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import DonorAPIClient from "../../../APIClients/DonorAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import * as Routes from "../../../constants/Routes";
import { DonorResponse } from "../../../types/DonorTypes";
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
