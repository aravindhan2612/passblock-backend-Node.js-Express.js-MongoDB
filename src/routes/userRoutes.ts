import express, { Router } from 'express';
import { registerUser, loginUser, updateUserProfile, getCurrentUser, updateUserPassword } from '../handlers/user';
import { verifyToken } from '../middleware/auth';



const router = Router()
// POST - Register (Sign Up)
router.post('/register', registerUser)

//POST - Login
router.post('/login', loginUser);

// GET /api/users/me - Get current logged-in user
router.use(verifyToken);
router.get('/me', getCurrentUser);
router.post('/updateUser', updateUserProfile);
router.post('/updatePassword', updateUserPassword);

export default router