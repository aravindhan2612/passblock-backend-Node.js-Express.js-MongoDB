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
exports.addPassword = addPassword;
exports.updatePassword = updatePassword;
exports.getPasswords = getPasswords;
exports.getPassword = getPassword;
exports.deletePassword = deletePassword;
const PasswordEntity_1 = __importDefault(require("../models/PasswordEntity"));
const favicon_fetcher_1 = require("@hyperjumptech/favicon-fetcher");
function addPassword(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        const { name, usernameOrUserId, websiteLink, password, tag } = request.body;
        const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            response.status(401).json({ error: "Unauthorized: User ID not found" });
            return;
        }
        const existingUser = yield PasswordEntity_1.default.findOne({
            name,
            usernameOrUserId,
        });
        if (existingUser) {
            response.status(400).json({ error: "Password data already existing" });
            return;
        }
        if (!name || !usernameOrUserId || !password) {
            response.status(400).json({
                message: "Please enter all required fields: name, username/userId, and password",
            });
            return;
        }
        try {
            // const salt = await bcrypt.genSalt(10);
            // const passwordHash = await bcrypt.hash(password, salt);
            // Create a new Password document
            const faviconUrl = (websiteLink !== undefined && websiteLink !== "") ? (yield (0, favicon_fetcher_1.getFavicon)(normalizeUrl(websiteLink))) : "";
            console.log("faviconUrl =>", faviconUrl);
            const newPassword = new PasswordEntity_1.default({
                name,
                usernameOrUserId,
                websiteLink: normalizeUrl(websiteLink),
                password: password,
                tag: tag,
                userId: (_b = request.user) === null || _b === void 0 ? void 0 : _b.userId,
                faviconUrl: faviconUrl, // Associate the password entry with the authenticated user
            });
            // Respond with the newly created password entry (excluding the hash for security)
            const responsePassword = yield newPassword.save();
            response.status(201).json(responsePassword);
        }
        catch (error) {
            console.error("Error adding password:", error.message);
            // Handle Mongoose validation errors
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((err) => err.message);
                response.status(400).json({ error: messages.join(", ") });
                return;
            }
            response
                .status(500)
                .json({ message: "Server error while adding password" });
        }
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { id } = req.params; // Get the password entry ID from the URL parameters
        console.log(Object.assign({}, req.body));
        const { name, usernameOrUserId, websiteLink, password, tag } = req.body;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId; // Get updated fields from body
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        try {
            let passwordEntry = yield PasswordEntity_1.default.findById(id);
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
            const faviconUrl = (websiteLink !== undefined && websiteLink !== "") ? (yield (0, favicon_fetcher_1.getFavicon)(normalizeUrl(websiteLink))) : "";
            // Prepare update object
            const updateFields = {};
            if (name !== undefined)
                updateFields.name = name;
            if (usernameOrUserId !== undefined)
                updateFields.usernameOrUserId = usernameOrUserId;
            if (websiteLink !== undefined)
                updateFields.websiteLink = normalizeUrl(websiteLink);
            if (password !== undefined)
                updateFields.password = password;
            if (tag !== undefined)
                updateFields.tag = tag;
            updateFields.faviconUrl = faviconUrl;
            // If a new password is provided, hash it before updating
            // if (password !== undefined) {
            //   const salt = await bcrypt.genSalt(10);
            //   updateFields.passwordHash = await bcrypt.hash(password, salt);
            // }
            // Find and update the password entry. { new: true } returns the updated document.
            // { runValidators: true } ensures schema validators are run on update.
            passwordEntry = yield PasswordEntity_1.default.findOneAndUpdate({ _id: id, userId: userId }, { $set: updateFields }, { new: true, runValidators: true });
            // Respond with the updated password entry (excluding the hash)
            const responsePassword = passwordEntry === null || passwordEntry === void 0 ? void 0 : passwordEntry.toObject();
            res.status(200).json(responsePassword);
        }
        catch (error) {
            console.error("Error updating password:", error.message);
            if (error.name === "CastError") {
                res.status(400).json({ error: "Invalid password entry ID" });
                return;
            }
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((err) => err.message);
                res.status(400).json({ error: messages.join(", ") });
                return;
            }
            res.status(500).json({ error: "Server error while updating password" });
        }
    });
}
function getPasswords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        try {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            // Find all password entries belonging to the authenticated user
            // The .select('-passwordHash') ensures the hashed password is not sent to the client
            const passwords = yield PasswordEntity_1.default.find({ userId: req.user.userId }).sort({
                createdAt: -1,
            });
            res.status(200).json(passwords);
        }
        catch (error) {
            console.error("Error fetching passwords:", error.message);
            res.status(500).json({ error: "Server error while fetching passwords" });
        }
    });
}
function getPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        try {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            const passwordEntry = yield PasswordEntity_1.default.findById(req.params.id);
            // Check if the password entry exists
            if (!passwordEntry) {
                res.status(404).json({ error: "Password entry not found" });
                return;
            }
            res.status(200).json(passwordEntry);
        }
        catch (error) {
            console.error("Error fetching password:", error.message);
            res.status(500).json({ error: "Server error while fetching password" });
        }
    });
}
function deletePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params; // Get the password entry ID from the URL parameters
        // Ensure the user is authenticated
        if (!req.user || !req.user.userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        try {
            const passwordEntry = yield PasswordEntity_1.default.findById(id);
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
            yield PasswordEntity_1.default.findByIdAndDelete(id);
            res.status(200).json({ message: "Password entry deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting password:", error.message);
            if (error.name === "CastError") {
                res.status(400).json({ error: "Invalid password entry ID" });
                return;
            }
            res.status(500).json({ error: "Server error while deleting password" });
        }
    });
}
const normalizeUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }
    return url;
};
