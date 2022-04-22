import { NextFunction, Request, Response } from "express";

import AuthService from "../services/implementations/authService";
import UserService from "../services/implementations/userService";
import IAuthService from "../services/interfaces/authService";
import { Role } from "../types";

const authService: IAuthService = new AuthService(new UserService());

export const getAccessToken = (req: Request) => {
  const authHeaderParts = req.headers.authorization?.split(" ");
  console.log("CHOCO: req", req);
  console.log("CHOCO:", authHeaderParts);
  if (
    authHeaderParts &&
    authHeaderParts.length >= 2 &&
    authHeaderParts[0].toLowerCase() === "bearer"
  ) {
    return authHeaderParts[1];
  }
  return null;
};

/* Determine if request is authorized based on accessToken validity and role of client */
export const isAuthorizedByRole = (roles: Set<Role>) => {
  console.log("TIRAMISU: Role");
  console.log("roles", roles);
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    console.log("TIRAMISU:", accessToken);
    const authorized =
      accessToken && (await authService.isAuthorizedByRole(accessToken, roles));
    if (!authorized) {
      console.log("TIRAMISU: Role not authorized");
      return res
        .status(401)
        .json({ error: "You are not authorized to make this request." });
    }
    return next();
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the userId that the token was issued to matches the requested userId
 * Note: userIdField is the name of the request parameter containing the requested userId */
export const isAuthorizedByUserId = (userIdField: string) => {
  console.log("TIRAMISU: UserId");
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByUserId(
        accessToken,
        req.params[userIdField],
      ));
    if (!authorized) {
      console.log("TIRAMISU: UserId not authorized");
      return res
        .status(401)
        .json({ error: "You are not authorized to make this request." });
    }
    return next();
  };
};

/* Determine if request for a user-specific resource is authorized based on accessToken
 * validity and if the email that the token was issued to matches the requested email
 * Note: emailField is the name of the request parameter containing the requested email */
export const isAuthorizedByEmail = (emailField: string) => {
  console.log("TIRAMISU: Email");
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    const authorized =
      accessToken &&
      (await authService.isAuthorizedByEmail(
        accessToken,
        req.params[emailField],
      ));
    if (!authorized) {
      return res
        .status(401)
        .json({ error: "You are not authorized to make this request." });
    }
    return next();
  };
};
