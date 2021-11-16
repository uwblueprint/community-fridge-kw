import { Request, Response, NextFunction } from "express";
import { nextTick } from "process";
import { getApiValidationError, validatePrimitive } from "./util";
import { Role } from "../../types";
/* eslint-disable-next-line import/prefer-default-export */
export const loginRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.idToken) {
    if (!validatePrimitive(req.body.idToken, "string")) {
      return res.status(400).json(getApiValidationError("idToken", "string"));
    }
  } else {
    if (!validatePrimitive(req.body.email, "string")) {
      return res.status(400).send(getApiValidationError("email", "string"));
    }
    if (!validatePrimitive(req.body.password, "string")) {
      return res.status(400).send(getApiValidationError("password", "string"));
    }
  }
  return next();
};

export const registerRequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.firstName, "string")) {
    return res.status(400).send(getApiValidationError("firstName", "string"));
  }
  if (!validatePrimitive(req.body.lastName, "string")) {
    return res.status(400).send(getApiValidationError("lastName", "string"));
  }
  if (!validatePrimitive(req.body.email, "string")) {
    return res.status(400).send(getApiValidationError("email", "string"));
  }
  if (!validatePrimitive(req.body.password, "string")) {
    return res.status(400).send(getApiValidationError("password", "string"));
  }
  if (!validatePrimitive(req.body.phoneNumber, "string")) {
    return res.status(400).send(getApiValidationError("phoneNumber", "string"));
  }

  if (req.body.role === Role.VOLUNTEER) {
    return next();
  }

  if (req.body.role === "Donor") {
    if (
      req.body.facebookLink &&
      !validatePrimitive(req.body.facebookLink, "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("facebookLink", "string"));
    }
    if (
      req.body.instagramLink &&
      !validatePrimitive(req.body.instagramLink, "string")
    ) {
      return res
        .status(400)
        .send(getApiValidationError("instagramLink", "string"));
    }
    if (!validatePrimitive(req.body.businessName, "string")) {
      return res
        .status(400)
        .send(getApiValidationError("businessName", "string"));
    }
  }
  return next();
};
