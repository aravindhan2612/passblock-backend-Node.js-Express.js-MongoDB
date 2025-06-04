import { Router } from 'express';
import { registerUser, loginUser } from '../handlers/auth';
const router = Router()

// Load environment variables


// POST - Register (Sign Up)
router.post('/register',registerUser)

//POST - Login
router.post('/login', loginUser);

export default router