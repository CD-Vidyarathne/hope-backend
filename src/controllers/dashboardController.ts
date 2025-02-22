import { Request, Response } from "express";
import User from "../models/userModel";
import Event from "../models/eventModel";
import { EventStatus } from "../types/enums";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const totalDonors = await User.count({ where: { role: "normal" } });
    const totalAidSeekers = await User.count({ where: { role: "patient" } });
    const totalVolunteers = await User.count({ where: { role: "normal" } });
    const totalUsers = await User.count();
    const totalEvents = await Event.count({
      where: {
        status: EventStatus.UPCOMING,
      },
    });

    res.status(200).json({
      totalDonors,
      totalAidSeekers,
      totalVolunteers,
      totalUsers,
      totalEvents,
    });
    return;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data." });
    return;
  }
};
