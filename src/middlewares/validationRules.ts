import { body } from "express-validator";
import { Gender, Roles, DonationType } from "../types/enums";

export const signUpValidationRules = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("gender")
    .isIn(Object.values(Gender))
    .withMessage("Gender must be 'male', 'female', or 'other'"),
  body("birthDate")
    .isISO8601()
    .toDate()
    .withMessage("Birth date must be a valid date in YYYY-MM-DD format"),
  body("role")
    .isIn(Object.values(Roles))
    .withMessage("Role must be 'donor', 'patient', 'child', or 'elder'"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("nic").optional().isString().withMessage("NIC must be a string"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Phone number must be a string"),
];

export const loginValidationRules = [
  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

export const createRequestValidationRules = [
  body("neededAmount")
    .isFloat({ gt: 0 })
    .withMessage("Needed amount must be a positive number."),

  body("donationType")
    .isIn(Object.values(DonationType))
    .withMessage("Donation type must be one of the valid types."),
];
