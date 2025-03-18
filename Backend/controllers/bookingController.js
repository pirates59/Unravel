// controllers/bookingController.js
const Booking = require("../models/Booking");

// Helper to normalize date
function normalizeToUTC(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Get booked dates
exports.getBookedDates = async (req, res) => {
  const { month, year } = req.query;
  try {
    const bookings = await Booking.find({ month, year });
    const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
    const bookedDates = {};

    bookings.forEach((booking) => {
      const dateKey = `${booking.year}-${booking.month}-${booking.day}`;
      if (!bookedDates[dateKey])
        bookedDates[dateKey] = { times: [], isFullyBooked: false };
      bookedDates[dateKey].times.push(booking.time);
      if (bookedDates[dateKey].times.length === timeSlots.length) {
        bookedDates[dateKey].isFullyBooked = true;
      }
    });

    res.json(bookedDates);
  } catch (err) {
    console.error("Error fetching booked dates:", err.message);
    res.status(500).json({ success: false, message: "Error fetching bookings." });
  }
};

// Book a timeslot
exports.bookTimeslot = async (req, res) => {
  const { date, time, firstName, lastName, contact, email, service, therapist } = req.body;
  if (!date || !time || !firstName || !lastName || !contact || !email || !service || !therapist) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }
  try {
    const normalizedDate = normalizeToUTC(date);
    const year = normalizedDate.getUTCFullYear();
    const month = normalizedDate.getUTCMonth() + 1;
    const day = normalizedDate.getUTCDate();

    const existing = await Booking.findOne({ year, month, day, time });
    if (existing) {
      return res.status(400).json({ message: "Timeslot already booked." });
    }
    const booking = new Booking({ year, month, day, time, firstName, lastName, contact, email, service, therapist });
    await booking.save();
    res.status(201).json({ message: "Booking successful!" });
  } catch (err) {
    console.error("Error booking:", err);
    res.status(500).json({ error: err.message || "Failed to book timeslot." });
  }
};

// Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find();
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
