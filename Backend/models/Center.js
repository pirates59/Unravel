const mongoose = require("mongoose");

const CenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // stores path to uploaded image
});

module.exports = mongoose.model("Center", CenterSchema);
