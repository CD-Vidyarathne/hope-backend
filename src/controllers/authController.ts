import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/authModel";
import User from "../models/userModel";
import sequelize from "../config/db";
import logger from "../utils/logger";

export const signup = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      email,
      password,
      name,
      address,
      gender,
      nic,
      birthDate,
      phone,
      role,
    } = req.body;

    const existingUser = await Auth.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      logger.error("Transaction rolled back : Email is already registered.");
      res.status(400).json({ message: "Email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRecord = await User.create(
      {
        email,
        name,
        address,
        gender,
        nic,
        birthDate,
        phone,
        role,
      },
      { transaction },
    );

    const authRecord = await Auth.create(
      { userId: userRecord.id, email, password: hashedPassword },
      { transaction },
    );

    await transaction.commit();

    logger.info(`Signup successful for ${email}`);
    res.status(201).json({
      message: "Signup successful!",
      user: { id: userRecord.id, email: authRecord.email },
    });
    return;
  } catch (error) {
    await transaction.rollback();
    logger.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const authRes = await Auth.findOne({ where: { email } });
    if (!authRes) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, authRes.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      },
    );

    logger.info(`Login successful for ${email}`);
    res.status(200).json({
      token,
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        address: user.address,
        userType: user.role,
        contactNumber: user.phone,
        birthdate: user.birthDate,
        gender: user.gender,
        profilePicURL: user.dpURL,
      },
    });
    return;
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error." });
    return;
  }
};
