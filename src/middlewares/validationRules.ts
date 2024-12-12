import { body } from "express-validator";
import { RequestHandler } from "express";

export const registrationValidationRules: RequestHandler[] = [
  body("username")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
];

export const loginValidationRules: RequestHandler[] = [
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];
