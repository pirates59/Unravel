// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

router.get("/booked-dates", bookingController.getBookedDates);
router.post("/book", bookingController.bookTimeslot);
router.get("/appointments", verifyToken, bookingController.getAppointments);

module.exports = router;
