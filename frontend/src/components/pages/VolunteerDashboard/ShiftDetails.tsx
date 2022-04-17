import { Center, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CheckInAPIClient from "../../../APIClients/CheckInAPIClient";
import SchedulingAPIClient from "../../../APIClients/SchedulingAPIClient";
import {
  CheckInWithShiftType,
  ScheduleWithShiftType,
  ShiftType,
} from "../../../types/VolunteerTypes";
import ConfirmShiftDetails from "../VolunteerScheduling/ConfirmShiftDetails";

const VolunteerShiftDetailsPage = (): JSX.Element => {
  const { id, type } = useParams<{ id: string; type: ShiftType }>();
  const [currentShift, setCurrentShift] = useState<
    ScheduleWithShiftType | CheckInWithShiftType
  >();

  useEffect(() => {
    const getShiftData = async () => {
      if (type === ShiftType.SCHEDULING) {
        const schedule = await SchedulingAPIClient.getScheduleById(id);
        setCurrentShift({ ...schedule, type: ShiftType.SCHEDULING });
      } else {
        const checkIn = await CheckInAPIClient.getCheckInsById(id);
        setCurrentShift({ ...checkIn, type: ShiftType.CHECKIN });
      }
    };
    getShiftData();
  }, [id]);

  if (!currentShift) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    currentShift && (
      <ConfirmShiftDetails shift={currentShift} viewDetailsScreen />
    )
  );
};

export default VolunteerShiftDetailsPage;
