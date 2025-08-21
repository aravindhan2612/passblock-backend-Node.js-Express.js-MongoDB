import express, { Router } from 'express';
import { registerUser, loginUser, updateUserProfile, getCurrentUser, uploadProfilePicture } from '../handlers/user';
import { verifyToken } from '../middleware/auth';
import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads/';
    if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
    // Specify the directory for storing images
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const router = Router()
// POST - Register (Sign Up)
router.post('/register',registerUser)

//POST - Login
router.post('/login', loginUser);

// GET /api/users/me - Get current logged-in user
router.use(verifyToken);
router.get('/me', getCurrentUser);
router.post('/updateUser', updateUserProfile);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture)


export default router