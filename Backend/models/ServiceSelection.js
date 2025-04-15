// models/ServiceSelection.js
const mongoose = require("mongoose");

// Schema for mapping selected service with assigned therapist
const ServiceSelectionSchema = new mongoose.Schema({
  service:   { type: String, required: true },  // Selected service name
  therapist: { type: String, required: true },  // Assigned therapist name
});

module.exports = mongoose.model("ServiceSelection", ServiceSelectionSchema);
