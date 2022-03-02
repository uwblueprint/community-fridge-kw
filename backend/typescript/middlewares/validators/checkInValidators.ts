import { Request, Response, NextFunction } from "express";
import { DayPart, Frequency, Status } from "../../types";
import { getApiValidationError, validatePrimitive, validateDate } from "./util";

export const createCheckInDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validateDate(req.body.startDate)) {
    return res
      .status(400)
      .send(getApiValidationError("startDate", "Date string"));
  }
  if (!validateDate(req.body.endDate)) {
    return res
      .status(400)
      .send(getApiValidationError("endDate", "Date string"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }
  if (req.body.isAdmin && !validatePrimitive(req.body.isAdmin, "boolean")) {
    return res.status(400).send(getApiValidationError("isAdmin", "boolean"));
  }
  if (
    req.body.volunteerId &&
    !validatePrimitive(req.body.volunteerId, "string")
  ) {
    return res.status(400).send(getApiValidationError("volunteerId", "string"));
  }
  if (
    new Date(req.body.startDate).getTime() >=
    new Date(req.body.endDate).getTime()
  ) {
    return res
      .status(400)
      .send(getApiValidationError("dates", "Date string", false, true));
  }

  return next();
};

export const updateCheckInDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.startDate && !validateDate(req.body.startDate)) {
    return res
      .status(400)
      .send(getApiValidationError("startDate", "Date string"));
  }
  if (req.body.endDate && !validateDate(req.body.endDate)) {
    return res
      .status(400)
      .send(getApiValidationError("endDate", "Date string"));
  }
  if (
    new Date(req.body.startDate).getTime() >=
    new Date(req.body.endDate).getTime()
  ) {
    return res
      .status(400)
      .send(getApiValidationError("dates", "Date string", false, true));
  }
  if (req.body.isAdmin && !validatePrimitive(req.body.isAdmin, "boolean")) {
    return res.status(400).send(getApiValidationError("isAdmin", "boolean"));
  }
  if (
    req.body.volunteerId &&
    !validatePrimitive(req.body.volunteerId, "string")
  ) {
    return res.status(400).send(getApiValidationError("volunteerId", "string"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }

  return next();
};
