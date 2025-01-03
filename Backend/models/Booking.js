const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  time: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  therapist: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
