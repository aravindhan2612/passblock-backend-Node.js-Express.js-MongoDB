import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Multer } from "multer";

export const serveUploadedFile = (req: Request, res: Response) => {
  try {
    const filename = req.params.filename; // Get filename from URL parameter
    const filePath = path.join(__dirname, "../..", "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Send the file
      res.sendFile(filePath);
    } else {
      // File not found, send a 404 response
      res.status(404).send("File not found");
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export async function getFiles(req: Request, res: Response): Promise<void> {
  try {
    const filename = req.params.filename; // Get filename from URL parameter
    const filePath = path.join(__dirname, "../..", "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Send the file
      res.sendFile(filePath);
    } else {
      // File not found, send a 404 response
      res.status(404).send("File not found");
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const deleteUploadedFile = (req: Request, res: Response) => {
  const filename = req.params.filename; // Get filename from the URL parameter
  const filePath = path.join(__dirname, "..", "uploads", filename);

  // Check if the file exists before attempting to delete
  if (fs.existsSync(filePath)) {
    try {
      // Synchronously delete the file
      fs.unlinkSync(filePath);
      // Send a success response
      res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
      // Handle any errors that occur during deletion
      console.error("Error deleting file:", err);
      res.status(500).json({ message: "Error deleting file" });
    }
  } else {
    // If the file doesn't exist, send a 404 response
    res.status(404).json({ message: "File not found" });
  }
};
