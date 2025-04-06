// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

// Fetch users
router.get("/api/users", verifyToken, userController.fetchUsers);

// Update user profile image
router.post("/update-profile", verifyToken, upload.single("profileImage"), userController.updateProfile);

// Freeze a user account
router.put("/api/users/freeze/:id", verifyToken, userController.freezeUser);

// Delete a user account
router.delete("/api/users/:id", verifyToken, userController.deleteUser);

module.exports = router;
