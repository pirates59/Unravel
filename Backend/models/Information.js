//models/Information.js
const mongoose = require('mongoose');

// Schema for storing personal information
const InformationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  contact:   { type: String, required: true },
  email:     { type: String, required: true },
});

// Export the Information model
module.exports = mongoose.model("Information", InformationSchema);
