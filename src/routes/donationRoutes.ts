import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  getDonationsFromUser,
  getDonationsToUser,
} from "../controllers/donationController";

const router = express.Router();

router.post("/", createDonation);

router.get("/", getAllDonations);

router.get("/:id", getDonationById);

router.get("/from/:userId", getDonationsFromUser);

router.get("/to/:userId", getDonationsToUser);

export default router;
