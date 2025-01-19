import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/storage";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx"],
    resource_type: "auto",
  }),
});

const upload = multer({ storage });

export default upload;
