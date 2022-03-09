import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

const checkInDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
