import { Router } from "express";

import dayjs from "dayjs";
import ICheckInService from "../services/interfaces/checkInService";
import CheckInService from "../services/implementations/checkInService";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import getErrorMessage from "../utilities/errorMessageUtil";

const checkInRouter: Router = Router();

const checkInService: ICheckInService = new CheckInService();

checkInRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const { volunteerId } = req.query;
  const contentType = req.headers["content-type"];

  if (id && volunteerId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot get by both id and volunteerId",
      },
    ]);
    return;
  }
  if (!id && !volunteerId) {
    try {
      const checkIns = await checkInService.getAllCheckIns();
      res.status(200).json(checkIns);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  } else if (id) {
    try {
      const checkIns = await checkInService.getCheckInsById(id);
      res.status(200).json(checkIns);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  } else if (volunteerId) {
    try {
      const checkIns = await checkInService.getCheckInsByVolunteerId(
        volunteerId as string,
      );
      res.status(200).json(checkIns);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

/* Delete checkins by id (e.g. /checkin/63)
  or deletes by start and end date range
  (e.g. /checkin?startDate=2022-01-31T05:00:00.000Z?endDate=2022-02-31T05:00:00.000Z)
*/
checkInRouter.delete("/:id?", async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;
  const contentType = req.headers["content-type"];

  if (id && (startDate || endDate)) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot delete by both id and startDate/endDate",
      },
    ]);
    return;
  }

  if (id) {
    try {
      await checkInService.deleteCheckInById(id);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }

  if (!(startDate && endDate)) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Must supply both startDate and endDate query parameters",
      },
    ]);
    return;
  }

  if (startDate && endDate) {
    const startDateRange = dayjs(startDate as string);
    const endDateRange = dayjs(endDate as string);

    if (!startDateRange.isValid() || !endDateRange.isValid()) {
      await sendResponseByMimeType(res, 400, contentType, [
        {
          error: "startDate and endDate must be valid dates",
        },
      ]);
    }
    if (startDateRange.isAfter(endDateRange)) {
      await sendResponseByMimeType(res, 400, contentType, [
        {
          error: "startDate must be before endDate",
        },
      ]);
    }
    try {
      await checkInService.deleteCheckInsByDateRange(
        startDate as string,
        endDate as string,
      );
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

export default checkInRouter;
