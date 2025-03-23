// models/Therapist.js
const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  daysAvailable: {
    type: [String], // e.g. ["Sun", "Mon"] or however you want to store
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  image: {
    type: String, // This will store the path/filename to the uploaded image
  },
});

module.exports = mongoose.model("Therapist", therapistSchema);
