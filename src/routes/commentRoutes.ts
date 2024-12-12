import express from "express";
import {
  createComment,
  getCommentsByBlogId,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.post("/blogs/:id/comments", createComment);
router.get("/blogs/:id/comments", getCommentsByBlogId);
router.get("/blogs/:id/comments/:commentId", getCommentById);
router.put("/blogs/:id/comments/:commentId", updateComment);
router.delete("/blogs/:id/comments/:commentId", deleteComment);

export default router;
