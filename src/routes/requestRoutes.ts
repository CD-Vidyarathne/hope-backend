import { Router } from "express";
import {
  createRequest,
  getRequestById,
  getRequestsByType,
  updateRequest,
  deleteRequest,
  getAllRequests,
} from "../controllers/requestController";
import {
  createRequestValidationRules,
  updateRequestStatusValidationRules,
} from "../middlewares/validationRules";
import { validate } from "../middlewares/validate";

const router = Router();

router.post("/", createRequestValidationRules, validate, createRequest);
router.get("/type/", getRequestsByType);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
