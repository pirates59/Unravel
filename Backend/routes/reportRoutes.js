// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../middleware/verifyToken");

// Get all reported comments
router.get("/api/reported-comments", verifyToken, reportController.getReportedComments);

// Release a reported comment (set reported to false)
router.put("/api/reported-comments/release/:id", verifyToken, reportController.releaseComment);

module.exports = router;
