import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Multer } from "multer";
import User from "../models/UserEntity";

export async function uploadProfilePicture(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    const user = await User.findById(userId);

    // If a profile picture already exists, delete the old file
    if (user && user.profilePictureName !== "" && user.profilePictureName !== undefined) {
      const oldFilePath = path.join(__dirname, "../..", "uploads", user.profilePictureName);
      deleteFile(oldFilePath);
    }

    // The 'req.file' object is now typed correctly
    const file = req.file as Express.Multer.File;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { profilePictureName: file.filename },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

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

export async function deleteUploadedFile(req: Request, res: Response): Promise<void> {
  const filename = req.params.filename; // Get filename from the URL parameter
  const filePath = path.join(__dirname, "../..", "uploads", filename);
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Check if the file exists before attempting to delete
  if (fs.existsSync(filePath)) {
    try {
      // Synchronously delete the file
      fs.unlinkSync(filePath);
      // Send a success response
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { profilePictureName: "" },
        { new: true }
      );
      res.status(200).json(user);
    } catch (err) {
      // Handle any errors that occur during deletion
      console.error("Error deleting file:", err);
      res.status(500).json({ error: "Error deleting file" });
    }
  } else {
    // If the file doesn't exist, send a 404 response
    res.status(404).json({ error: "File not found" });
  }
};


const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
