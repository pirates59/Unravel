// models/Room.js
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // stores path to uploaded image
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("Room", RoomSchema);
