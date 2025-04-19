// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");

// Protected route to fetch all notifications for the logged-in user
router.get("/api/notification", verifyToken, notificationController.getNotifications);

// Protected route to mark all notifications as read
router.put("/api/notification", verifyToken, notificationController.markAllAsRead);

// Protected route to mark a single notification as read by ID
router.put("/api/notification/:notificationId", verifyToken, notificationController.markSingleAsRead);

module.exports = router;
