import express from "express";
import {
  promoteUser,
  demoteUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { Roles } from "../types/roles";

const router = express.Router();

router.use(authenticate, authorize([Roles.ADMIN]));

router.get("/", getAllUsers);
router.put("/:userId/promote", promoteUser);
router.put("/:userId/demote", demoteUser);
router.delete("/:userId", deleteUser);

export default router;
