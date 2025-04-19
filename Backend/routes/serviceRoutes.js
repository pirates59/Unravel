// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// Route to handle service selection and assigned therapist
router.post("/service-selection", serviceController.selectService);

module.exports = router;
