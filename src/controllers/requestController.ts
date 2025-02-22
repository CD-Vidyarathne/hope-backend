import { Request, Response } from "express";
import DonationRequest from "../models/requestModel";
import sequelize from "../config/db";
import logger from "../utils/logger";
import { DonationType, RequestStatus, RequestType } from "../types/enums";

export const createRequest = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      userId,
      neededAmount,
      reason,
      description,
      donationType,
      requestType,
      documentURL,
    } = req.body;

    console.log(donationType);
    console.log(DonationType);

    const request = await DonationRequest.create(
      {
        userId,
        neededAmount,
        reason,
        description,
        donationType,
        requestType,
        documentURL,
        date: new Date(),
        status: RequestStatus.PENDING,
      },
      { transaction },
    );

    await transaction.commit();

    logger.info(`Donation request created by user ${userId}`);
    res.status(201).json({
      message: "Donation request created successfully",
      request,
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating donation request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const validStatuses = Object.values(RequestStatus);
    if (status && !validStatuses.includes(status as RequestStatus)) {
      res.status(400).json({ message: "Invalid status parameter" });
      return;
    }

    const whereClause = status ? { status } : {};

    const requests = await DonationRequest.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: ["user"],
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRequestsByType = async (req: Request, res: Response) => {
  console.log("Getting requests by type");
  try {
    const { requestType } = req.query;

    if (!requestType) {
      res.status(400).json({ message: "Request type is required" });
      return;
    }

    const requests = await DonationRequest.findAll({
      where: { requestType },
      include: ["user"],
    });

    res.status(200).json({ requests });
  } catch (error) {
    logger.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await DonationRequest.findAll({
      include: ["user"],
    });

    res.status(200).json({ requests });
  } catch (error) {
    logger.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = await DonationRequest.findByPk(id, {
      include: ["user"],
    });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json({ request });
  } catch (error) {
    logger.error("Error fetching request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, description, donationType, neededAmount, date } = req.body;

    const request = await DonationRequest.findByPk(id);

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.reason = reason;
    request.description = description;
    request.donationType = donationType;
    request.neededAmount = neededAmount;
    request.date = date;
    request.status = RequestStatus.ONGOING;

    await request.save();

    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = await DonationRequest.findByPk(id);

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    await request.destroy();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
