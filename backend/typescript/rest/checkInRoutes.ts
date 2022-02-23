import { Router } from "express";

import ICheckInService from "../services/interfaces/checkInService";
import CheckInService from "../services/implementations/checkInService";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import getErrorMessage from "../utilities/errorMessageUtil";

const checkInRouter: Router = Router();

const checkInService: ICheckInService = new CheckInService();

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
  // handle case if only one of start date or end date are passed in ? or do i handle this in api client
  if (!(startDate && endDate)) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Must supply both startDate and endDate query parameters",
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
  if (startDate && endDate) {
    try {
      await checkInService.deleteCheckInByDateRange(startDate, endDate);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

export default checkInRouter;
