import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticate);
router.post("/blogs/", createBlog);
router.get("/blogs/", getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

export default router;
