// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.post("/service-selection", serviceController.selectService);

module.exports = router;
