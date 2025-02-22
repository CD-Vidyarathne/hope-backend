import express from "express";
import { getDashboardData } from "../controllers/dashboardController";

const router = express.Router();

router.get("/summary", getDashboardData);

export default router;
