import { Request, Response } from "express";
import User from "../models/userModel";
import logger from "../utils/logger";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Users fetched successfully.", users });
    return;
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users." });
    return;
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json({
      id: user.id,
      username: user.name,
      email: user.email,
      address: user.address,
      userType: user.role,
      contactNumber: user.phone,
      birthdate: user.birthDate,
      gender: user.gender,
      profilePicURL: user.dpURL,
    });
    return;
  } catch (error) {
    logger.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to retrieve user." });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { address, contactNumber, role, dpURL } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    user.address = address || user.address;
    user.phone = contactNumber || user.phone;
    user.role = role || user.role;
    user.dpURL = dpURL || user.dpURL;

    await user.save();

    res.status(200).json({ message: "User updated successfully.", user });
    return;
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user." });
    return;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully." });
    return;
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
    return;
  }
};
