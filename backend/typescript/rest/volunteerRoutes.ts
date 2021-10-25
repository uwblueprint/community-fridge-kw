import { Router } from "express";
import { isAuthorizedByRole } from "../middlewares/auth";
import {
  createUserDtoValidator,
  updateUserDtoValidator,
} from "../middlewares/validators/userValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import VolunteerService from "../services/implementations/volunteerService";
import IAuthService from "../services/interfaces/authService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import IVolunteerService from "../services/interfaces/volunteerService";
import { UserDTO, UserVolunteerDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const volunteerRouter: Router = Router();
const volunteerService: IVolunteerService = new VolunteerService();

volunteerRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const volunteers = await volunteerService.getVolunteers();
    await sendResponseByMimeType<UserVolunteerDTO>(
      res,
      200,
      contentType,
      volunteers,
    );
  } catch (error: any) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: error.message,
      },
    ]);
  }
});

volunteerRouter.get("/:volunteerID", async (req, res) => {
  const { volunteerID } = req.params;
  const contentType = req.headers["content-type"];

  if (!volunteerID) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by missing volunteerID.",
      },
    ]);
    return;
  }

  if (volunteerID) {
    if (typeof volunteerID !== "string") {
      res
        .status(400)
        .json({ error: "volunteerID query parameter must be a string." });
    } else {
      try {
        const volunteer = await volunteerService.getVolunteerByID(volunteerID);
        res.status(200).json(volunteer);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  }
});

volunteerRouter.put("/:volunteerID", async (req, res) => {
  const { id } = req.query;
});

volunteerRouter.delete("/:volunteerID", async (req, res) => {
  const { id } = req.query;
});

export default volunteerRouter;
