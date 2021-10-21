import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive, validateDate } from "./util";

export const createSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.donorId, "integer")) {
    return res.status(400).send(getApiValidationError("donorId", "integer"));
  }
  if (!validateDate(req.body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "Date string"));
  }
  if (!validateDate(req.body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "Date string"));
  }
  if (
    new Date(req.body.startTime).getTime() >=
    new Date(req.body.endTime).getTime()
  ) {
    return res
      .status(400)
      .send(getApiValidationError("dates", "Date string", false, true));
  }
  if (!validatePrimitive(req.body.status, "string")) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }
  if (!validatePrimitive(req.body.volunteersNeeded, "integer")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteersNeeded", "integer"));
  }

  return next();
};

export const updateSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.description &&
    !validatePrimitive(req.body.description, "string")
  ) {
    return res.status(400).send(getApiValidationError("description", "string"));
  }
  if (req.body.quantity && !validatePrimitive(req.body.quantity, "integer")) {
    return res.status(400).send(getApiValidationError("quantity", "integer"));
  }
  if (
    req.body.pickupLocation &&
    !validatePrimitive(req.body.pickupLocation, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("pickupLocation", "string"));
  }
  if (
    req.body.status &&
    !(
      req.body.status === "Approved" ||
      req.body.status === "Pending" ||
      req.body.status === "Rejected"
    )
  ) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }
  if (req.body.startTime && !validateDate(req.body.startTime)) {
    return res
      .status(400)
      .send(getApiValidationError("startTime", "Date string"));
  }
  if (req.body.endTime && !validateDate(req.body.endTime)) {
    return res
      .status(400)
      .send(getApiValidationError("endTime", "Date string"));
  }
  if (
    new Date(req.body.startTime).getTime() >=
    new Date(req.body.endTime).getTime()
  ) {
    return res
      .status(400)
      .send(getApiValidationError("dates", "Date string", false, true));
  }
  if (
    req.body.volunteersNeeded &&
    !validatePrimitive(req.body.volunteersNeeded, "integer")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("volunteersNeeded", "integer"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }
  return next();
};
