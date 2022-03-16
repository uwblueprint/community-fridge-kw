import { Request, Response, NextFunction } from "express";
import { Status } from "../../types";
import { getApiValidationError } from "./util";

const volunteerDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.status && !Object.values(Status).includes(req.body.status)) {
    return res.status(400).send(getApiValidationError("status", "Status"));
  }

  return next();
};

export default volunteerDtoValidator;
