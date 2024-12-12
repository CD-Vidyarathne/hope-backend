import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`Error on ${req.method} ${req.url}: ${err.message}`);
};

export default errorHandler;
