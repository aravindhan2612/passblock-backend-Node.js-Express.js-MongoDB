"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../handlers/user");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST - Register (Sign Up)
router.post('/register', user_1.registerUser);
//POST - Login
router.post('/login', user_1.loginUser);
// GET /api/users/me - Get current logged-in user
router.use(auth_1.verifyToken);
router.get('/me', user_1.getCurrentUser);
router.post('/updateUser', user_1.updateUserProfile);
exports.default = router;
