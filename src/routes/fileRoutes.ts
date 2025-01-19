import { Router } from "express";
import upload from "../middlewares/fileUpload";
import { uploadFile } from "../controllers/fileController";

const router = Router();

router.post("/upload", upload.single("file"), uploadFile);

export default router;
