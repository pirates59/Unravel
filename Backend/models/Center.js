//models/Center.js
const mongoose = require("mongoose");

// Schema for a therapy center with name and image
const CenterSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  image: { type: String }, // stores path to uploaded image
});

// Export the Center model
module.exports = mongoose.model("Center", CenterSchema);
