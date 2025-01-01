const mongoose = require("mongoose");

const ServiceSelectionSchema = new mongoose.Schema({
  service: { type: String, required: true },
  therapist: { type: String, required: true },
});

module.exports = mongoose.model("ServiceSelection", ServiceSelectionSchema);
