import { Router } from "express";
import volunteerDtoValidator from "../middlewares/validators/volunteerValidator";
import nodemailerConfig from "../nodemailer.config";
import CheckInService from "../services/implementations/checkInService";
import DonorService from "../services/implementations/donorService";
import EmailService from "../services/implementations/emailService";
import SchedulingService from "../services/implementations/schedulingService";
import VolunteerService from "../services/implementations/volunteerService";
import ICheckInService from "../services/interfaces/checkInService";
import IDonorService from "../services/interfaces/donorService";
import IEmailService from "../services/interfaces/emailService";
import ISchedulingService from "../services/interfaces/schedulingService";
import IVolunteerService from "../services/interfaces/volunteerService";
import getErrorMessage from "../utilities/errorMessageUtil";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const volunteerRouter: Router = Router();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const donorService: IDonorService = new DonorService();
const checkInService: ICheckInService = new CheckInService();
const schedulingService: ISchedulingService = new SchedulingService(emailService, donorService);
const volunteerService: IVolunteerService = new VolunteerService(
  checkInService,
  schedulingService
);

/* Get all volunteers and optionally filter by:
  - volunteerId, through URI (ex. /volunteer/1)
  - userId, through query param (ex. /volunteer/?userId=1)
*/
volunteerRouter.get("/:volunteerId?", async (req, res) => {
  const { volunteerId } = req.params;
  const { userId } = req.query;

  const contentType = req.headers["content-type"];

  if (volunteerId && userId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by both volunteerId and userId.",
      },
    ]);
    return;
  }

  if (!volunteerId && !userId) {
    try {
      const volunteers = await volunteerService.getVolunteers();
      await sendResponseByMimeType(res, 200, contentType, volunteers);
    } catch (error) {
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
        .json({ error: "volunteerId query parameter must be a string." });
    } else {
      try {
        const volunteer = await volunteerService.getVolunteerById(volunteerId);
        res.status(200).json(volunteer);
      } catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    }
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string" });
      return;
    }
    try {
      const volunteer = await volunteerService.getVolunteerByUserId(userId);
      res.status(200).json(volunteer);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

volunteerRouter.get("/shifts/:volunteerId?", async (req, res) => {
  const { volunteerId } = req.params;

  if (volunteerId) {
    try {
      const shifts = await volunteerService.getCheckInsAndSchedules(volunteerId as string);
      res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  }
});

/* Update volunteer status by:
  - id, through URI (ex. /volunteers/1)
  - userId, through query param (ex. /volunteers/?userId=1)
*/
volunteerRouter.put(
  "/:volunteerId?",
  volunteerDtoValidator,
  async (req, res) => {
    const { volunteerId } = req.params;
    const { userId } = req.query;
    const contentType = req.headers["content-type"];

    if (volunteerId && userId) {
      await sendResponseByMimeType(res, 400, contentType, [
        {
          error: "Cannot update by both volunteerId and userId",
        },
      ]);
      return;
    }
    if (volunteerId) {
      try {
        await volunteerService.updateVolunteerById(volunteerId, {
          status: req.body.status,
        });

        res.status(201).send();
      } catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    } else if (userId) {
      try {
        await volunteerService.updateVolunteerByUserId(userId as string, {
          status: req.body.status,
        });

        res.status(201).send();
      } catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
      }
    } else {
      res.status(400).json({ error: "Must supply id as request parameter." });
    }
  },
);

volunteerRouter.delete("/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;

  try {
    await volunteerService.deleteVolunteerById(volunteerId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(getErrorMessage(error));
  }
});

export default volunteerRouter;
