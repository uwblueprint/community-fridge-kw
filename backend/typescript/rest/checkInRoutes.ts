import { Router } from "express";

import {
  createCheckInDtoValidator,
  CheckInGeneralDtoValidator,
} from "../middlewares/validators/checkInValidators";
import getErrorMessage from "../utilities/errorMessageUtil";
import CheckInService from "../services/implementations/checkInService";
import ICheckInService from "../services/interfaces/checkInService";
import IEmailService from "../services/interfaces/emailService";
import nodemailerConfig from "../nodemailer.config";
import EmailService from "../services/implementations/emailService";
import IVolunteerService from "../services/interfaces/volunteerService";
import VolunteerService from "../services/implementations/volunteerService";

const emailService: IEmailService = new EmailService(nodemailerConfig);
const volunteerService: IVolunteerService = new VolunteerService();

const checkInRouter: Router = Router();
const checkInService: ICheckInService = new CheckInService(
  emailService,
  volunteerService,
);

/* Create a check in instance */
checkInRouter.post("/", createCheckInDtoValidator, async (req, res) => {
  try {
    const newCheckIn = await checkInService.createCheckIn(req.body);
    res.status(201).json(newCheckIn);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Update the check in instance by id */
checkInRouter.put("/:id", CheckInGeneralDtoValidator, async (req, res) => {
  try {
    const updatedCheckIn = await checkInService.updateCheckInById(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedCheckIn);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default checkInRouter;
