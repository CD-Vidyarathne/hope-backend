import { Router } from "express";
import { signup, login } from "../controllers/authController";
import {
  loginValidationRules,
  signUpValidationRules,
} from "../middlewares/validationRules";
import { validate } from "../middlewares/validate";

const router = Router();

router.post("/signup", signUpValidationRules, validate, signup);
router.post("/login", loginValidationRules, validate, login);

export default router;
