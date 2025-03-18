// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");

router.get("/api/notification", verifyToken, notificationController.getNotifications);
router.put("/api/notification", verifyToken, notificationController.markAllAsRead);
router.put("/api/notification/:notificationId", verifyToken, notificationController.markSingleAsRead);

module.exports = router;
