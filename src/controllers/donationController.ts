import { Request, Response } from "express";
import Donation from "../models/donationModel";
import DonationRequest from "../models/requestModel";
import { Op } from "sequelize";
import User from "../models/userModel";

export const createDonation = async (req: Request, res: Response) => {
  console.log("Here");
  const { amount, requestId, fromUserId, toUserId } = req.body;

  try {
    const donation = await Donation.create({
      fromUserId,
      toUserId,
      amount,
      date: new Date(),
      requestId,
    });

    const request = await DonationRequest.findByPk(requestId);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.currentlyFilled += amount;
    await request.save();

    res.status(201).json(donation);
    return;
  } catch (error: any) {
    console.error("Error creating donation:", error);
    res
      .status(500)
      .json({ message: "Failed to create donation", error: error.message });
    return;
  }
};

export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.findAll({
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    res.status(200).json(donations);
    return;
  } catch (error: any) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      message: "Failed to fetch donations",
      error: error.message,
    });
    return;
  }
};

export const getDonationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findByPk(id, {
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    if (!donation) {
      res.status(404).json({ message: "Donation not found" });
      return;
    }

    res.status(200).json(donation);
    return;
  } catch (error: any) {
    console.error("Error fetching donation:", error);
    res.status(500).json({
      message: "Failed to fetch donation",
      error: error.message,
    });
    return;
  }
};

export const getDonationsFromUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Fetch donations where the user is the donor
    const donations = await Donation.findAll({
      where: { fromUserId: userId },
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    if (donations.length === 0) {
      res
        .status(404)
        .json({ message: `No donations found for donor ${userId}` });
      return;
    }

    res.status(200).json(donations);
    return;
  } catch (error: any) {
    console.error("Error fetching donations from user:", error);
    res.status(500).json({
      message: "Failed to fetch donations from user",
      error: error.message,
    });
    return;
  }
};

export const getDonationsToUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const donations = await Donation.findAll({
      where: { toUserId: userId },
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    if (donations.length === 0) {
      res
        .status(404)
        .json({ message: `No donations found for recipient ${userId}` });
      return;
    }

    res.status(200).json(donations);
    return;
  } catch (error: any) {
    console.error("Error fetching donations to user:", error);
    res.status(500).json({
      message: "Failed to fetch donations to user",
      error: error.message,
    });
    return;
  }
};
