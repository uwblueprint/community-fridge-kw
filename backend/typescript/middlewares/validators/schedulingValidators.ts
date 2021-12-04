import { Request, Response, NextFunction } from "express";
import { DayPart, Frequency, Status } from "../../types";
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
  if (!validatePrimitive(req.body.donorId, "string")) {
    return res.status(400).send(getApiValidationError("donorId", "string"));
  }
  if (!validateCategories(req.body.categories)) {
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
  if (!Object.values(DayPart).includes(req.body.dayPart)) {
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
  if (
    req.body.volunteerTime &&
    !validatePrimitive(req.body.volunteerTime, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("volunteerTime", "string"));
  }
  if (!Object.values(Frequency).includes(req.body.frequency)) {
    return res.status(400).send(getApiValidationError("frequency", "string"));
  }
  if (
    req.body.recurringDonationEndDate &&
    !validateDate(req.body.recurringDonationEndDate)
  ) {
    return res
      .status(400)
      .send(getApiValidationError("recurringDonationEndDate", "Date string"));
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
    req.body.frequency &&
    !Object.values(Frequency).includes(req.body.frequency)
  ) {
    return res.status(400).send(getApiValidationError("frequency", "string"));
  }
  if (
    req.body.recurringDonationEndDate &&
    !validateDate(req.body.recurringDonationEndDate)
  ) {
    return res
      .status(400)
      .send(getApiValidationError("recurringDonationEndDate", "Date string"));
  }
  if (
    req.body.volunteerNeeded &&
    !validatePrimitive(req.body.volunteerNeeded, "boolean")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("volunteerNeeded", "boolean"));
  }
  if (
    req.body.volunteerTime &&
    !validatePrimitive(req.body.volunteerTime, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("volunteerTime", "string"));
  }
  if (req.body.dayPart && !Object.values(DayPart).includes(req.body.dayPart)) {
    return res.status(400).send(getApiValidationError("dayPart", "string"));
  }
  if (req.body.notes && !validatePrimitive(req.body.notes, "string")) {
    return res.status(400).send(getApiValidationError("notes", "string"));
  }
  return next();
};
