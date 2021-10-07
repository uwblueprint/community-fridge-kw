import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

// TODO: validate dates and enums
export const createSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.donorId, "integer")) {
    return res.status(400).send(getApiValidationError("donorId", "integer"));
  }
  if (!validatePrimitive(req.body.startTime, "string")) {
    return res.status(400).send(getApiValidationError("startTime", "string"));
  }
  if (!validatePrimitive(req.body.endTime, "string")) {
    return res.status(400).send(getApiValidationError("endTime", "string"));
  }
  if (!validatePrimitive(req.body.status, "string")) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }
  if (!validatePrimitive(req.body.volunteersNeeded, "integer")) {
    return res.status(400).send(getApiValidationError("volunteersNeeded", "integer"));
  }

  return next();
};

export const updateSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.description && !validatePrimitive(req.body.description, "string")) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (req.body.quantity && !validatePrimitive(req.body.quantity, "integer")) {
    return res.status(400).send(getApiValidationError("quantity", "integer"));
  }
  if (req.body.pickupLocation && !validatePrimitive(req.body.pickupLocation, "string")) {
    return res.status(400).send(getApiValidationError("pickupLocation", "string"));
  }
  if (req.body.status && !(req.body.status == "Approved" || req.body.status == "Pending" || req.body.status == "Rejected")) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }
  if (req.body.volunteersNeeded && !validatePrimitive(req.body.volunteersNeeded, "integer")) {
    return res.status(400).send(getApiValidationError("volunteersNeeded", "integer"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }
  return next();
};
