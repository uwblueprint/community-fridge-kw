import { Request, Response, NextFunction } from "express";
import { Status } from "../../types";
import { getApiValidationError, validatePrimitive } from "./util";

const volunteerDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!Object.values(Status).includes(req.body.status)) {
    return res.status(400).send(getApiValidationError("status", "string"));
  }

  return next();
};

export default volunteerDtoValidator;
