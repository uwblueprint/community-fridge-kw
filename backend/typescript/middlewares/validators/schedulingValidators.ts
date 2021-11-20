import { Request, Response, NextFunction } from "express";
import { Status } from "../../types";
import {
  getApiValidationError,
  validatePrimitive,
  validateDate,
  validateCategories,
} from "./util";

export const createSchedulingDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validatePrimitive(req.body.donorId, "integer")) {
    return res.status(400).send(getApiValidationError("donorId", "integer"));
  }
  if (!validateCategories(req.body.categories)) {
    return res
      .status(400)
      .send("categories is not an array of accepted category strings");
  }
  if (req.body.size && !validatePrimitive(req.body.size, "string")) {
    return res.status(400).send(getApiValidationError("size", "string"));
  }
  if (!validatePrimitive(req.body.isPickup, "boolean")) {
    return res.status(400).send(getApiValidationError("isPickup", "boolean"));
  }
  if (
    req.body.pickupLocation &&
    !validatePrimitive(req.body.pickupLocation, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("pickupLocation", "string"));
  }
  if (!validatePrimitive(req.body.dayPart, "string")) {
    return res.status(400).send(getApiValidationError("dayPart", "string"));
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
  if (!validatePrimitive(req.body.volunteerNeeded, "boolean")) {
    return res
      .status(400)
      .send(getApiValidationError("volunteerNeeded", "boolean"));
  }
  if (req.body.volunteerTime && !validatePrimitive(req.body.volunteerTime, "string")) {
    return res.status(400).send(getApiValidationError("volunteerTime", "string"));
  }
  if (!validatePrimitive(req.body.frequency, "string")) {
    return res.status(400).send(getApiValidationError("frequency", "string"));
  }
  if (req.body.recurringDonationId && !validatePrimitive(req.body.recurringDonationId, "integer")) {
    return res.status(400).send(getApiValidationError("recurringDonationId", "integer"));
  }
  if (req.body.recurringEndDate && !validateDate(req.body.recurringEndDate)) {
    return res
      .status(400)
      .send(getApiValidationError("recurringEndDate", "Date string"));
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
  if (req.body.categories && !validateCategories(req.body.categories)) {
    return res
      .status(400)
      .send("categories is not an array of accepted category strings");
  }
  if (req.body.size && !validatePrimitive(req.body.size, "string")) {
    return res.status(400).send(getApiValidationError("size", "string"));
  }
  if (req.body.isPickup && !validatePrimitive(req.body.isPickup, "boolean")) {
    return res.status(400).send(getApiValidationError("isPickup", "boolean"));
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
    req.body.volunteerNeeded &&
    !validatePrimitive(req.body.volunteerNeeded, "boolean")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("volunteerNeeded", "boolean"));
  }
  if (req.body.frequency && !validatePrimitive(req.body.frequency, "string")) {
    return res.status(400).send(getApiValidationError("frequency", "string"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }
  return next();
};
