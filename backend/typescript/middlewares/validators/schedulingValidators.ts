import { Request, Response, NextFunction } from "express";
import { Status } from "../../types";
import { getApiValidationError, validatePrimitive, validateDate } from "./util";

export const createSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.donorId, "integer")) {
    return res.status(400).send(getApiValidationError("donorId", "integer"));
  }
  if (!validatePrimitive(req.body.category, "string")) {
    return res.status(400).send(getApiValidationError("category", "string"));
  }
  if (req.body.quantity && !validatePrimitive(req.body.quantity, "integer")) {
    return res.status(400).send(getApiValidationError("quantity", "integer"));
  }
  if (req.body.size && !validatePrimitive(req.body.size, "string")) {
    return res.status(400).send(getApiValidationError("size", "string"));
  }
  if (
    req.body.pickupLocation &&
    !validatePrimitive(req.body.pickupLocation, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("pickupLocation", "string"));
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
  if (!validatePrimitive(req.body.volunteersNeeded, "integer")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteersNeeded", "integer"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }

  return next();
};

export const updateSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.category && !validatePrimitive(req.body.category, "string")) {
    return res.status(400).send(getApiValidationError("category", "string"));
  }
  if (req.body.quantity && !validatePrimitive(req.body.quantity, "integer")) {
    return res.status(400).send(getApiValidationError("quantity", "integer"));
  }
  if (req.body.size && !validatePrimitive(req.body.size, "string")) {
    return res.status(400).send(getApiValidationError("size", "string"));
  }
  if (
    req.body.pickupLocation &&
    !validatePrimitive(req.body.pickupLocation, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("pickupLocation", "string"));
  }
  if (req.body.status && !Object.values(Status).includes(req.body.status)) {
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
