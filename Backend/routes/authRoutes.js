// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

// Authentication routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/check-email", authController.checkEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

// User routes
router.post("/update-profile", verifyToken, upload.single("profileImage"), userController.updateProfile);

// Additional routes can be added (fetch users, delete user, etc.)

module.exports = router;
