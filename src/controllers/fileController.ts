import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileUrl = (req.file as any).path;

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
    return;
  }
};
