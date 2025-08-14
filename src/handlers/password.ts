import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Password, { IPassword } from "../models/PasswordEntity";
import { getFavicon } from "@hyperjumptech/favicon-fetcher";

export async function addPassword(
  request: Request,
  response: Response
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { name, usernameOrUserId, websiteLink, password, tag } = request.body;
  const userId = request?.user?.userId;
  if (!userId) {
    response.status(401).json({ error: "Unauthorized: User ID not found" });
    return;
  }
  const existingUser = await Password.findOne({
    name,
    usernameOrUserId,
  });
  if (existingUser) {
    response.status(400).json({ error: "Password data already existing" });
    return;
  }

  if (!name || !usernameOrUserId || !password) {
    response.status(400).json({
      message:
        "Please enter all required fields: name, username/userId, and password",
    });
    return;
  }

  try {
    // const salt = await bcrypt.genSalt(10);
    // const passwordHash = await bcrypt.hash(password, salt);
    // Create a new Password document
    const faviconUrl = (websiteLink !== undefined && websiteLink !== "" ) ? (await getFavicon(normalizeUrl(websiteLink))) as string : "";
    console.log("faviconUrl =>", faviconUrl);
    const newPassword: IPassword = new Password({
      name,
      usernameOrUserId,
      websiteLink:normalizeUrl(websiteLink),
      password: password,
      tag: tag,
      userId: request.user?.userId,
      faviconUrl: faviconUrl, // Associate the password entry with the authenticated user
    });

    // Respond with the newly created password entry (excluding the hash for security)
    const responsePassword = await newPassword.save();
    response.status(201).json(responsePassword);
  } catch (error: any) {
    console.error("Error adding password:", error.message);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      response.status(400).json({ error: messages.join(", ") });
      return;
    }
    response
      .status(500)
      .json({ message: "Server error while adding password" });
  }
}

export async function updatePassword(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params; // Get the password entry ID from the URL parameters
  console.log({ ...req.body });
  const { name, usernameOrUserId, websiteLink, password, tag } = req.body;
  const userId = req?.user?.userId; // Get updated fields from body

  // Ensure the user is authenticated
  if (!req.user || !req.user.userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    let passwordEntry = await Password.findById(id);

    // Check if the password entry exists
    if (!passwordEntry) {
      res.status(404).json({ error: "Password entry not found" });
      return;
    }

    // Ensure the authenticated user owns this password entry
    if (passwordEntry.userId.toString() !== req.user.userId) {
      res
        .status(403)
        .json({ error: "Not authorized to update this password entry" });
      return;
    }

    const faviconUrl = (websiteLink !== undefined && websiteLink !== "" ) ? (await getFavicon(normalizeUrl(websiteLink))) as string : "";
    
    // Prepare update object
    const updateFields: Partial<IPassword> = {};
    if (name !== undefined) updateFields.name = name;
    if (usernameOrUserId !== undefined)
      updateFields.usernameOrUserId = usernameOrUserId;
    if (websiteLink !== undefined) updateFields.websiteLink = normalizeUrl(websiteLink);
    if (password !== undefined) updateFields.password = password;
    if (tag !== undefined) updateFields.tag = tag;
    updateFields.faviconUrl = faviconUrl

    // If a new password is provided, hash it before updating
    // if (password !== undefined) {
    //   const salt = await bcrypt.genSalt(10);
    //   updateFields.passwordHash = await bcrypt.hash(password, salt);
    // }

    // Find and update the password entry. { new: true } returns the updated document.
    // { runValidators: true } ensures schema validators are run on update.
    passwordEntry = await Password.findOneAndUpdate(
      { _id: id, userId: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    // Respond with the updated password entry (excluding the hash)
    const responsePassword = passwordEntry?.toObject();
    res.status(200).json(responsePassword);
  } catch (error: any) {
    console.error("Error updating password:", error.message);
    if (error.name === "CastError") {
      res.status(400).json({ error: "Invalid password entry ID" });
      return;
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({ error: messages.join(", ") });
      return;
    }
    res.status(500).json({ error: "Server error while updating password" });
  }
}

export async function getPasswords(req: Request, res: Response): Promise<void> {
  // Ensure the user is authenticated
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Find all password entries belonging to the authenticated user
    // The .select('-passwordHash') ensures the hashed password is not sent to the client
    const passwords = await Password.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(passwords);
  } catch (error: any) {
    console.error("Error fetching passwords:", error.message);
    res.status(500).json({ error: "Server error while fetching passwords" });
  }
}
export async function getPassword(req: Request, res: Response): Promise<void> {
  // Ensure the user is authenticated
  if (!req.user || !req.user.userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const passwordEntry = await Password.findById(req.params.id);

    // Check if the password entry exists
    if (!passwordEntry) {
      res.status(404).json({ error: "Password entry not found" });
      return;
    }
    res.status(200).json(passwordEntry);
  } catch (error: any) {
    console.error("Error fetching password:", error.message);
    res.status(500).json({ error: "Server error while fetching password" });
  }
}

export async function deletePassword(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params; // Get the password entry ID from the URL parameters

  // Ensure the user is authenticated
  if (!req.user || !req.user.userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const passwordEntry = await Password.findById(id);

    // Check if the password entry exists
    if (!passwordEntry) {
      res.status(404).json({ error: "Password entry not found" });
      return;
    }

    // Ensure the authenticated user owns this password entry
    if (passwordEntry.userId.toString() !== req.user.userId) {
      res
        .status(403)
        .json({ error: "Not authorized to delete this password entry" });
      return;
    }

    // Delete the password entry
    await Password.findByIdAndDelete(id);

    res.status(200).json({ message: "Password entry deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting password:", error.message);
    if (error.name === "CastError") {
      res.status(400).json({ error: "Invalid password entry ID" });
      return;
    }
    res.status(500).json({ error: "Server error while deleting password" });
  }
}

const normalizeUrl = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};
