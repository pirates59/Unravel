//models/Booking.js
const mongoose = require("mongoose");

// Schema for storing booking (appointment) details
const BookingSchema = new mongoose.Schema({
  // Date components for the booking
  year:      { type: Number, required: true },
  month:     { type: Number, required: true },
  day:       { type: Number, required: true },

  // Time slot for the appointment
  time:      { type: String, required: true },

  // Client personal information
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  contact:   { type: String, required: true },
  email:     { type: String, required: true },

  // Service details and assigned therapist
  service:   { type: String, required: true },
  therapist: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
