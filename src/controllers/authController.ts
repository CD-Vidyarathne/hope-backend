import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Roles } from "../types/roles";
import logger from "../utils/logger";

export const register = async (req: Request, res: Response) => {
  const { username, email, password, captchaToken } = req.body;

  try {
    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      },
    );

    const { success } = captchaResponse.data;

    if (!success) {
      res.status(400).json({ error: "reCAPTCHA validation failed" });
      return;
    }

    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ error: "Username is already taken" });
      return;
    }

    if (existingEmail) {
      res.status(400).json({ error: "Email is already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: Roles.USER, // Default role for new users
    });

    logger.info(
      `User ${newUser.username} (${newUser.email}) registered successfully`,
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Registration failed: ${error}`);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, captchaToken } = req.body;

  try {
    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      },
    );

    const { success, challenge_ts, hostname } = captchaResponse.data;

    if (!success) {
      logger.warn("Failed reCAPTCHA validation.");
      res.status(400).json({ error: "reCAPTCHA validation failed" });
      return;
    }

    logger.info(
      `reCAPTCHA validated successfully (timestamp: ${challenge_ts}, hostname: ${hostname}).`,
    );

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Username or Password is incorrect" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Username or Password is incorrect" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    logger.info(
      `User ${user.username} (${user.email}, ${user.role}) logged in successfully.`,
    );

    res.status(200).json({
      token,
      message: "Login successful",
      username: user.username,
      role: user.role,
      id: user.id,
    });
  } catch (error: any) {
    logger.error(`Login failed: ${error.message}`);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
};
