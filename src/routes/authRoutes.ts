import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../handlers/auth';
import { verifyToken } from '../middleware/auth';
const router = Router()


// POST - Register (Sign Up)
router.post('/register',registerUser)

//POST - Login
router.post('/login', loginUser);

// GET /api/users/me - Get current logged-in user
router.get('/me',verifyToken, getCurrentUser );

export default router