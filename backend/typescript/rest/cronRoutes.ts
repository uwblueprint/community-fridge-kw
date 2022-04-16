import { Router } from "express";
import getErrorMessage from "../utilities/errorMessageUtil";
import ICronService from "../services/interfaces/cronService";
import CronService from "../services/implementations/cronService";
import DonorService from "../services/implementations/donorService";
import IEmailService from "../services/interfaces/emailService";
import IDonorService from "../services/interfaces/donorService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";
import VolunteerService from "../services/implementations/volunteerService";
import IVolunteerService from "../services/interfaces/volunteerService";

const emailService: IEmailService = new EmailService(nodemailerConfig);
const donorService: IDonorService = new DonorService();
const volunteerService: IVolunteerService = new VolunteerService();
const cronRouter: Router = Router();
const cronService: ICronService = new CronService(
  emailService,
  donorService,
  volunteerService,
);

cronRouter.post("/schedules", async (req, res) => {
  try {
    await cronService.checkScheduleReminders();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

cronRouter.post("/checkins", async (req, res) => {
  try {
    await cronService.checkCheckInReminders();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default cronRouter;
