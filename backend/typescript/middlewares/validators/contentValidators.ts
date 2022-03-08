import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

const contentDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.foodRescueDescription &&
    !validatePrimitive(req.body.foodRescueDescription, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("foodRescueDescription", "string"));
  }
  if (
    req.body.foodRescueUrl &&
    !validatePrimitive(req.body.foodRescueUrl, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("foodRescueUrl", "string"));
  }
  if (
    req.body.checkinDescription &&
    !validatePrimitive(req.body.checkinDescription, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("checkinDescription", "string"));
  }
  if (
    req.body.checkinUrl &&
    !validatePrimitive(req.body.checkinUrl, "string")
  ) {
    return res.status(400).send(getApiValidationError("checkinUrl", "string"));
  }

  return next();
};

export default contentDtoValidator;
