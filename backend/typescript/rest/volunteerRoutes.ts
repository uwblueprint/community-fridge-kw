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
import { UserDTO, UserVolunteerDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const volunteerRouter: Router = Router();
volunteerRouter.use(isAuthorizedByRole(new Set(["Admin"])));
const volunteerService = new VolunteerService();
// const userService: IUserService = new UserService(); //make a volunteer service
// const emailService: IEmailService = new EmailService(nodemailerConfig);
// const authService: IAuthService = new AuthService(userService, emailService);

/* Post a volunteer  - SKIP FOR NOW */

/* Returns all volunteers */
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
  return;
});

/* Returns a volunteer by its id */
volunteerRouter.get("/:volunteerId", async (req, res) => {
  const { volunteerId } = req.params;
  const contentType = req.headers["content-type"];

  if (!volunteerId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by missing volunteerId.",
      },
    ]);
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
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }
});

/* Updates a volunteer by its id */
volunteerRouter.put("/:volunteerId", async (req, res) => {
  const { id } = req.query;
});

/* Deletes a volunteer by its id */
volunteerRouter.delete("/:volunteerId", async (req, res) => {
  const { id } = req.query;
});

export default volunteerRouter;
