import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(request: Request, response: Response): Promise<void> {
  const { fullName, email, password } = request.body;

  try {
      await new Promise(resolve => setTimeout(resolve, 3000));
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      response.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();


    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '4h' }
    );

    response.status(201).json({ token });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Server error' });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
       process.env.JWT_SECRET as string,
      { expiresIn: '4h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await User.findById(userId).select('-password'); // exclude password
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
}