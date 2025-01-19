import { Request, Response } from "express";
import ProfileRequest from "../models/profileReqModel";
import logger from "../utils/logger";

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ProfileRequest.findAll();
    res
      .status(200)
      .json({ message: "Requests fetched successfully.", requests });
    return;
  } catch (error) {
    logger.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to retrieve requests." });
    return;
  }
};

export const createRequest = async (req: Request, res: Response) => {
  const { userid, address, phone, role, dpURL } = req.body;
  try {
    const request = await ProfileRequest.create({
      userid,
      address,
      phone,
      role,
      dpURL,
    });
    res.status(201).json({ message: "Request created successfully.", request });
    return;
  } catch (error) {
    logger.error("Error creating request:", error);
    res.status(500).json({ message: "Failed to create request." });
    return;
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await ProfileRequest.findByPk(id);
    if (!request) {
      res.status(404).json({ message: "Request not found." });
      return;
    }
    await request.destroy();
    res.status(200).json({ message: "Request deleted successfully." });
    return;
  } catch (error) {
    logger.error("Error deleting request:", error);
    res.status(500).json({ message: "Failed to delete request." });
    return;
  }
};
