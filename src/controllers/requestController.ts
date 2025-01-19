import { Request, Response } from "express";
import { validationResult } from "express-validator";
import RequestModel from "../models/requestModel";
import User from "../models/userModel";
import {
  RequestStatus,
  RequestType,
  DonationType,
  Roles,
} from "../types/enums";
import logger from "../utils/logger";

export const createRequest = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { requestType, neededAmount, donationType, date } = req.body;

  try {
    const user = await User.findByPk(req.user?.id);
    if (!user || user.role === Roles.PATIENT) {
      return res
        .status(403)
        .json({ error: "You are not authorized to create requests." });
    }

    const request = await RequestModel.create({
      userId: req.user?.id,
      requestType: requestType as RequestType,
      neededAmount,
      status: RequestStatus.PENDING,
      donationType: donationType as DonationType,
      date,
    });

    logger.info(`User ${user.id} created the request ${request.id}`);

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
