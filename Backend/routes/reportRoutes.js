// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../middleware/verifyToken");

router.get("/api/reported-comments", verifyToken, reportController.getReportedComments);

module.exports = router;
