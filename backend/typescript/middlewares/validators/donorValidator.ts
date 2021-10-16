import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

export const donorDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.donorType, "string")) {
    return res.status(400).send(getApiValidationError("donorType", "string"));
  }
  if (!validatePrimitive(req.body.facebookLink, "string")) {
    return res.status(400).send(getApiValidationError("facebookLink", "string"));
  }
  if (!validatePrimitive(req.body.instagramLink, "string")) {
    return res.status(400).send(getApiValidationError("instagramLink", "string"));
  }
  if (!validatePrimitive(req.body.recurringDonor, "boolean")) {
    return res.status(400).send(getApiValidationError("recurringDonor", "boolean"));
  }
  if (!validatePrimitive(req.body.businessName, "string")) {
    return res.status(400).send(getApiValidationError("businessName", "string"));
  }
  
  return next();
};
