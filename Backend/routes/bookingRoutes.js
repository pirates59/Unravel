// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

// Public route to fetch already booked dates
router.get("/booked-dates", bookingController.getBookedDates);

// Public route to book a new timeslot
router.post("/book", bookingController.bookTimeslot);
router.get("/appointments", verifyToken, bookingController.getAppointments);

module.exports = router;
