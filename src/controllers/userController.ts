import { Request, Response } from "express";
import User from "../models/user";
import { Roles } from "../types/roles";
import logger from "../utils/logger";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("Here");
    const users = await User.findAll();
    res.status(200).json({ message: "Successfully fetched users", users });
  } catch (error) {
    logger.error(`Failed to fetch users: ${error}`);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

export const promoteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`User with ID ${userId} not found.`);
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.role === Roles.ADMIN) {
      logger.warn(`User ${userId} is already an Admin.`);
      res.status(400).json({ error: "User is already an Admin." });
      return;
    }

    const newRole = user.role === Roles.USER ? Roles.MODERATOR : Roles.ADMIN;
    user.role = newRole;
    await user.save();

    logger.info(`User ${userId} promoted to ${newRole}.`);
    res.status(200).json({ message: `User promoted to ${newRole}.`, user });
  } catch (error) {
    logger.error(`Failed to promote user ${userId}: ${error}`);
    res.status(500).json({ error: "Failed to promote user." });
  }
};

export const demoteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`User with ID ${userId} not found.`);
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.role === Roles.USER) {
      logger.warn(`User ${userId} is already a regular User.`);
      res.status(400).json({ error: "User is already a regular User." });
      return;
    }

    const newRole = user.role === Roles.ADMIN ? Roles.MODERATOR : Roles.USER;
    user.role = newRole;
    await user.save();

    logger.info(`User ${userId} demoted to ${newRole}.`);
    res.status(200).json({ message: `User demoted to ${newRole}.`, user });
  } catch (error) {
    logger.error(`Failed to demote user ${userId}: ${error}`);
    res.status(500).json({ error: "Failed to demote user." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`User with ID ${userId} not found.`);
      res.status(404).json({ error: "User not found" });
      return;
    }

    await user.destroy();

    logger.info(`User ${userId} deleted by Admin.`);
    res.status(200).json({ message: "User account deleted successfully." });
  } catch (error) {
    logger.error(`Failed to delete user ${userId}: ${error}`);
    res.status(500).json({ error: "Failed to delete user." });
  }
};
