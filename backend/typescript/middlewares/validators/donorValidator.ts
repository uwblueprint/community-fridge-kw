import { Request, Response, NextFunction } from "express";
import { getApiValidationError, validatePrimitive } from "./util";

const donorDtoValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.body.facebookLink &&
    !validatePrimitive(req.body.facebookLink, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("facebookLink", "string"));
  }
  if (
    req.body.instagramLink &&
    !validatePrimitive(req.body.instagramLink, "string")
  ) {
    return res
      .status(400)
      .send(getApiValidationError("instagramLink", "string"));
  }
  if (!validatePrimitive(req.body.businessName, "string")) {
    return res
      .status(400)
      .send(getApiValidationError("businessName", "string"));
  }

  return next();
};

export default donorDtoValidator;
