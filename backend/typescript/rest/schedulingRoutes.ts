import { Router } from "express";

import {
  createSchedulingDtoValidator,
  updateSchedulingDtoValidator,
} from "../middlewares/validators/schedulingValidators";
import nodemailerConfig from "../nodemailer.config";
import EmailService from "../services/implementations/emailService";
import SchedulingService from "../services/implementations/schedulingService";
import IEmailService from "../services/interfaces/emailService";
import ISchedulingService from "../services/interfaces/schedulingService";
import { SchedulingDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import getErrorMessage from "../utilities/errorMessageUtil";
import IDonorService from "../services/interfaces/donorService";
import DonorService from "../services/implementations/donorService";

const schedulingRouter: Router = Router();

// Commenting out authorization for now
// schedulingRouter.use(isAuthorizedByRole(new Set(["Admin"])));

const emailService: IEmailService = new EmailService(nodemailerConfig);
const donorService: IDonorService = new DonorService();
const schedulingService: ISchedulingService = new SchedulingService(
  emailService,
  donorService,
);

schedulingRouter.get("/volunteers/:volunteerId?", async (req, res) => {
  const { volunteerId } = req.params;
  const { isVolunteerSlotFilled } = req.query;
  const contentType = req.headers["content-type"];


  if (volunteerId && isVolunteerSlotFilled) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by multiple parameters.",
      },
    ]);
    return;
  }

  if (!volunteerId && !isVolunteerSlotFilled) {
    try {
      const schedulings = await schedulingService.getSchedulingsByVolunteersNeeded();
      await sendResponseByMimeType<SchedulingDTO>(
        res,
        200,
        contentType,
        schedulings,
      );
    } catch (error: unknown) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: getErrorMessage(error),
        },
      ]);
    }
    return;
  }

  if (volunteerId) {
    if (typeof volunteerId !== "string") {
      res
        .status(400)
        .json({ error: "volunteerId query parameter must be a string" });
      return;
    }

    try {
      const schedulings = await schedulingService.getSchedulingsByVolunteerId(
        volunteerId,
      );
      res.status(200).json(schedulings);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }

  if (isVolunteerSlotFilled) {
    if (
      typeof isVolunteerSlotFilled !== "string" ||
      (isVolunteerSlotFilled !== "true" && isVolunteerSlotFilled !== "false")
    ) {
      res.status(400).json({
        error:
          "volunteerId query parameter must be the string 'true' or 'false'",
      });
      return;
    }

    try {
      const schedulings = await schedulingService.getSchedulingsByVolunteersNeeded(
        isVolunteerSlotFilled === "true",
      );
      res.status(200).json(schedulings);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

schedulingRouter.get("/pickup/:isPickUp", async (req, res) => {
  const { isPickUp } = req.params;
  const contentType = req.headers["content-type"];

  console.log("pickup", isPickUp);

  if (typeof isPickUp !== "string") {
    res.status(400).json({
      error: "isPickUp query parameter must be the string 'true' or 'false'",
    });
    return;
  }

  try {
    const isPickUpCheck = isPickUp === "true";
    const schedulings = await schedulingService.getSchedulingsByPickUp(
      isPickUpCheck,
    );
    res.status(200).json(schedulings);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Get all schedulings, optionally filter by:
  - id, through URI (ex. /scheduling/1)
  - donorId through query param (ex. /scheduling/?donorId=1)
*/
schedulingRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const { donorId, weekLimit } = req.query;
  const contentType = req.headers["content-type"];

  if (id && donorId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by both id and donorId.",
      },
    ]);
    return;
  }

  if (!id && !donorId) {
    try {
      const schedulings = await schedulingService.getSchedulings();
      await sendResponseByMimeType<SchedulingDTO>(
        res,
        200,
        contentType,
        schedulings,
      );
    } catch (error: unknown) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: getErrorMessage(error),
        },
      ]);
    }
    return;
  }

  if (id) {
    try {
      const schedulings = await schedulingService.getSchedulingById(id);
      res.status(200).json(schedulings);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
    return;
  }

  if (donorId) {
    if (typeof donorId !== "string") {
      res
        .status(400)
        .json({ error: "donorId query parameter must be a string" });
      return;
    }

    try {
      const schedulings = await schedulingService.getSchedulingsByDonorId(
        donorId,
        Number(weekLimit),
      );
      res.status(200).json(schedulings);
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

/* Create a scheduling instance */
schedulingRouter.post("/", createSchedulingDtoValidator, async (req, res) => {
  try {
    const newScheduling = await schedulingService.createScheduling(req.body);
    res.status(201).json(newScheduling);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Update the scheduling instance by id */
schedulingRouter.put("/:id", updateSchedulingDtoValidator, async (req, res) => {
  try {
    const updatedScheduling = await schedulingService.updateSchedulingById(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedScheduling);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Delete scheduling by id (e.g. /scheduling/63)
  or deletes by recurring donation id 
  (e.g. /scheduling?recurringDonationId=1?currentDate=2022-01-31T05:00:00.000Z)
*/
schedulingRouter.delete("/:id?", async (req, res) => {
  const { id } = req.params;
  const { recurringDonationId, currentDate } = req.query;
  const contentType = req.headers["content-type"];

  if (id && recurringDonationId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot delete by both id and recurringSchedulingId",
      },
    ]);
    return;
  }
  if (recurringDonationId) {
    try {
      await schedulingService.deleteSchedulingByRecurringDonationId(
        recurringDonationId as string,
        currentDate as string,
      );
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  } else if (id) {
    try {
      await schedulingService.deleteSchedulingById(id);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  } else {
    res.status(400).json({ error: "Must supply id as request parameter." });
  }
});

export default schedulingRouter;
