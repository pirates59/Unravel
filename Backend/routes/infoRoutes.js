// routes/infoRoutes.js
const express = require("express");
const router = express.Router();
const infoController = require("../controllers/infoController");
const verifyToken = require("../middleware/verifyToken");

// Protected route to save user personal information
router.post("/information", verifyToken, infoController.saveInformation);

module.exports = router;
