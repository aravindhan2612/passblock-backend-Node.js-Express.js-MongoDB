"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
exports.updateUserProfile = updateUserProfile;
const UserEntity_1 = __importDefault(require("../models/UserEntity"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function registerUser(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fullName, email, password } = request.body;
        try {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            const existingUser = yield UserEntity_1.default.findOne({ email });
            if (existingUser) {
                response.status(400).json({ error: "User already exists" });
                return;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new UserEntity_1.default({
                fullName,
                email,
                password: hashedPassword,
            });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "4h" });
            response.status(201).json({ token });
        }
        catch (err) {
            console.error(err);
            response.status(500).json({ error: "Server error" });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            // Find user by email
            const user = yield UserEntity_1.default.findOne({ email });
            if (!user) {
                res.status(401).json({ error: "Invalid email or password" });
                return;
            }
            // Compare password
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: "Invalid email or password" });
                return;
            }
            // Create JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "4h" });
            res.json({ token });
        }
        catch (err) {
            res.status(500).json({ error: "Server error" });
        }
    });
}
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const user = yield UserEntity_1.default.findById(userId).select("-password"); // exclude password
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function updateUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const { fullName, email, phoneNumber, dateOfBirth, profilePicture } = req.body;
            const updateData = {};
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
            if (typeof profilePicture !== "undefined") {
                // Store base64 string directly in DB
                updateData.profilePicture = profilePicture;
            }
            const updatedUser = yield UserEntity_1.default.findByIdAndUpdate(userId, updateData, {
                new: true,
            }).select("-password");
            if (!updatedUser) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json(updatedUser);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
