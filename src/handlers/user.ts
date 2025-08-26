import { Express, Request, Response } from "express";
import User from "../models/UserEntity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Multer } from "multer";

export async function registerUser(
  request: Request,
  response: Response
): Promise<void> {
  const { fullName, email, password } = request.body;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      response.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "4h" }
    );

    response.status(201).json({ user,token });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "4h" }
    );

    res.json({ user, token  });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { fullName, email, phoneNumber, dateOfBirth } =
      req.body;
    const updateData: Record<string, any> = {};

    if (typeof fullName !== "undefined") {
      updateData.fullName = fullName;
    }

    if (typeof email !== "undefined") {
      updateData.email = email;
    }
    if (typeof phoneNumber !== "undefined") {
      updateData.phoneNumber = phoneNumber;
    }

    if (typeof dateOfBirth !== "undefined") {
      updateData.dateOfBirth = dateOfBirth;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


