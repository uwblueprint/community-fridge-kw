import { Router } from "express";

import { isAuthorizedByUserId } from "../middlewares/auth";
import {
  loginRequestValidator,
  registerRequestValidator,
} from "../middlewares/validators/authValidators";
import nodemailerConfig from "../nodemailer.config";
import AuthService from "../services/implementations/authService";
import DonorService from "../services/implementations/donorService";
import EmailService from "../services/implementations/emailService";
import UserService from "../services/implementations/userService";
import VolunteerService from "../services/implementations/volunteerService";
import IAuthService from "../services/interfaces/authService";
import IDonorService from "../services/interfaces/donorService";
import IEmailService from "../services/interfaces/emailService";
import IUserService from "../services/interfaces/userService";
import IVolunteerService from "../services/interfaces/volunteerService";
import { Role } from "../types";
import getErrorMessage from "../utilities/errorMessageUtil";

const authRouter: Router = Router();
const userService: IUserService = new UserService();
const emailService: IEmailService = new EmailService(nodemailerConfig);
const authService: IAuthService = new AuthService(userService, emailService);
const donorService: IDonorService = new DonorService();
const volunteerService: IVolunteerService = new VolunteerService();

/* Returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/login", loginRequestValidator, async (req, res) => {
  try {
    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );

    const { refreshToken, ...rest } = authDTO;

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure:
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "staging",
      })
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Register a user, returns access token and user info in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/register", registerRequestValidator, async (req, res) => {
  try {
    const user = await userService.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    });

    if (req.body.role === Role.VOLUNTEER) {
      await volunteerService.createVolunteer({
        userId: user.id,
        status: req.body.status,
      });
    } else if (req.body.role === Role.DONOR) {
      await donorService.createDonor({
        userId: user.id,
        businessName: req.body.businessName,
        facebookLink: req.body.facebookLink ?? null,
        instagramLink: req.body.instagramLink ?? null,
      });
    }

    const authDTO = await authService.generateToken(
      req.body.email,
      req.body.password,
    );
    const { refreshToken, ...rest } = authDTO;

    await authService.sendEmailVerificationLink(req.body.email);

    if (req.body.role === Role.VOLUNTEER) {
      await authService.sendAdminVolunteerSignUpEmail(
        req.body.email,
        `${req.body.firstName} ${req.body.lastName}`,
        [req.body.cityQuestionResponse, req.body.intentionQuestionResponse, req.body.skillsQuestionResponse],
      );
    }

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure:
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "staging",
      })
      .status(200)
      .json(rest);
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Returns access token in response body and sets refreshToken as an httpOnly cookie */
authRouter.post("/refresh", async (req, res) => {
  try {
    const token = await authService.renewToken(req.cookies.refreshToken);

    res
      .cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure:
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "staging",
      })
      .status(200)
      .json({ accessToken: token.accessToken });
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/* Revokes all of the specified user's refresh tokens */
authRouter.post(
  "/logout/:userId",
  isAuthorizedByUserId("userId"),
  async (req, res) => {
    try {
      await authService.revokeTokens(req.params.userId);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

/* Emails a password reset link to the user with the specified email */
authRouter.post("/resetPassword/:email", async (req, res) => {
  try {
    await authService.resetPassword(req.params.email);
    res.status(204).send();
  } catch (error: unknown) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

authRouter.post("/confirmEmailVerification/:oobCode", async (req, res) => {
  try {
    const response = await authService.verifyEmail(req.params.oobCode);
    if (response) {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

authRouter.post("/verifyPasswordResetCode/:oobCode", async (req, res) => {
  try {
    const response = await authService.verifyPasswordReset(req.params.oobCode);
    if (response) {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

authRouter.post("/confirmPasswordReset/:newPassword?", async (req, res) => {
  const { oobCode } = req.query;

  try {
    const response = await authService.confirmPasswordReset(
      req.params.newPassword,
      oobCode as string,
    );
    if (response) {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default authRouter;
