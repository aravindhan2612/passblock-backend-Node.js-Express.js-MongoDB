import { Router } from "express";
import { deleteUploadedFile, getFiles, uploadProfilePicture } from "../handlers/file";

import multer from "multer";
import path from "path";
import fs from 'fs';
import { verifyToken } from "../middleware/auth";
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

router.get('/:filename', getFiles);
router.use(verifyToken);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture)
router.delete('/:filename', deleteUploadedFile);

export default router