import { Router } from "express";

import { isAuthorizedByRole } from "../middlewares/auth";
import {
  createSchedulingDtoValidator,
  updateSchedulingDtoValidator,
} from "../middlewares/validators/schedulingValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import SchedulingService from "../services/implementations/schedulingService";
import IUserService from "../services/interfaces/userService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import ISchedulingService from "../services/interfaces/schedulingService";
import { SchedulingDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const schedulingRouter: Router = Router();

// Commenting out authorization for now
// schedulingRouter.use(isAuthorizedByRole(new Set(["Admin"])));

const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);
const schedulingService: ISchedulingService = new SchedulingService();

/* Get all schedulings, optionally filter by:
  - id, through URI (ex. /scheduling/1)
  - donorId, through query param (ex. /scheduling/?donorId=1)
*/
schedulingRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const { donorId } = req.body;

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
    } catch (error) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: error.message,
        },
      ]);
    }
    return;
  }

  if (id) {
    try {
      const schedulings = await schedulingService.getSchedulingById(id);
      res.status(200).json(schedulings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (donorId) {
    try {
      const schedulings = await schedulingService.getSchedulingsByDonorId(
        donorId,
      );
      res.status(200).json(schedulings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

/* Create a scheduling instance */
schedulingRouter.post("/", createSchedulingDtoValidator, async (req, res) => {
  try {
    const newScheduling = await schedulingService.createScheduling(req.body);
    res.status(201).json(newScheduling);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete scheduling by id */
schedulingRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    try {
      await schedulingService.deleteSchedulingById(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "Must supply id as query parameter." });
  }
});

export default schedulingRouter;
