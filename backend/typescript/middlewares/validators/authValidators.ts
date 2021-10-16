import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

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
  if (!validatePrimitive(req.body.password, "string")) {
    return res.status(400).send(getApiValidationError("phoneNumber", "string"));
  }

  if (req.body.role === "Donor") {
    if (!validatePrimitive(req.body.donorType, "string")) {
      return res.status(400).send(getApiValidationError("donorType", "string"));
    }
    if (req.body.facebookLink && !validatePrimitive(req.body.facebookLink, "string")) {
      return res.status(400).send(getApiValidationError("facebookLink", "string"));
    }
    if (req.body.instagramLink && !validatePrimitive(req.body.instagramLink, "string")) {
      return res.status(400).send(getApiValidationError("instagramLink", "string"));
    }
    if (req.body.recurringDonor && !validatePrimitive(req.body.recurringDonor, "boolean")) {
      return res.status(400).send(getApiValidationError("recurringDonor", "boolean"));
    }
    if (req.body.businessName && !validatePrimitive(req.body.businessName, "string")) {
      return res.status(400).send(getApiValidationError("businessName", "string"));
    }
  }

  return next();
};
