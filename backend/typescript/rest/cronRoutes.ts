import { Router } from "express";
import getErrorMessage from "../utilities/errorMessageUtil";
import ICronService from "../services/interfaces/cronService";
import CronService from "../services/implementations/cronService";
import DonorService from "../services/implementations/donorService";
import IEmailService from "../services/interfaces/emailService";
import IDonorService from "../services/interfaces/donorService";
import EmailService from "../services/implementations/emailService";
import nodemailerConfig from "../nodemailer.config";

const emailService: IEmailService = new EmailService(nodemailerConfig);
const donorService: IDonorService = new DonorService();
const cronRouter: Router = Router();
const cronService: ICronService = new CronService(emailService, donorService);

cronRouter.post("/donors", async (req, res) => {
  try {
    await cronService.checkReminders();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default cronRouter;
