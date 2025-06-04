import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registerUser(request: Request, response: Response): Promise<void> {
    const { fullName, phoneNumber, email, password } = request.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            response.status(400).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
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
         return;}

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}