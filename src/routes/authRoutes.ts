import express from "express";
import { login, register } from "../controllers/authController";
import {
  loginValidationRules,
  registrationValidationRules,
} from "../middlewares/validationRules";
import { validate } from "../middlewares/validate";

const router = express.Router();

router.post("/register", registrationValidationRules, validate, register);
router.post("/login", loginValidationRules, validate, login);

export default router;
