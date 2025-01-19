import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation Failed");
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
